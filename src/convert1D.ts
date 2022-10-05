import { FileCollection } from 'filelist-utils';
import { IOBuffer } from 'iobuffer';
import { createFromToArray as createXArray } from 'ml-spectra-processing';

import { Block } from './readBlock';
import { FileHeader } from './readFileHeader';
import { Param, getParameters } from './readProcPar';
import { setEndianFromValue } from './utils';

/*
 Code aims to parse the 1D fid file:
   |  filehead  blockhead  blockdata  blockhead  blockdata ...
  The file head is "meta", the rest is under "fid".
*/

/* For more than 1D, fid will be Block[] probably, the rest the same */
export interface Fid1D {
  meta: FileHeader /** head of the fid file.*/;

  fid: Block /** fid data + metadata */;

  x: Float64Array /** x is the time values. */;

  procpar: Param[] /** parameters set */;
}

/**
 * Converts 1D NMRs to object containing all parsed info.
 * Varian/Agilent store critical information in the procpar file.
 * @param fidDir - the fid directory as FileCollection
 * @return Fid Object containing the parsed information from the fid directory
 */
export async function convert1D(fidDir: FileCollection): Promise<Fid1D> {
  let fidB: ArrayBuffer | undefined;
  let procparB: ArrayBuffer | undefined;

  for (let fb of fidDir) {
    //get the binary data
    let val = fb.name.toLowerCase();
    switch (val) {
      case 'fid': {
        fidB = await fb.arrayBuffer();
        break;
      }
      case 'procpar': {
        procparB = await fb.arrayBuffer();
        break;
      }
      default:
        break;
    }
  }

  if (!fidB || !procparB) {
    /* check that files were found */
    throw new RangeError('fid and procpar must exist.');
  }

  const fidBuffer = new IOBuffer(fidB);
  setEndianFromValue(fidBuffer); /* some files may use big endian */
  const fileHeader = new FileHeader(fidBuffer);

  if (fileHeader.nBlocks !== 1) {
    //multiblocks still to be implemented
    throw new Error(`found nBlocks ${fileHeader.nBlocks}, but expected 1`);
  }

  const procpar = getParameters(new IOBuffer(procparB));

  /* acquisition time */
  let at: number | string | undefined;
  for (let par of procpar) {
    if (par.name === 'at') {
      at = par.values[0];
      break;
    }
  }

  if (typeof at !== 'number') {
    throw new Error('acquisition time parameter must exist and be a number.');
  } else {
    const x = createXArray({
      //time axis
      from: 0,
      to: at,
      length: fileHeader.np / 2, //all data seen is complex datapoints
      distribution: 'uniform',
    });

    /* read the data block(s) for the fid file */
    const fid = new Block(fidBuffer, fileHeader);

    return { meta: fileHeader, fid, procpar, x };
  }
}
