import { IOBuffer } from 'iobuffer';
import { createFromToArray as createXArray } from 'ml-spectra-processing';

import { Block } from './readBlock';
import { FileHeader } from './readFileHeader';
import { Param, getParameters } from './readProcPar';
import { setEndianFromValue } from './utils';

/** input format */
export interface VarianFiles {
  fidB: ArrayBuffer;
  procparB: ArrayBuffer;
}

export interface Fid {
  /** first block - header - of the fid file.*/
  meta: FileHeader;
  /** fid data + metadata */
  // fids: Block[]|Block; this will likely be used for 2D
  fid: Block;
  /** x is the time values. */
  x: Float64Array;
  /** parameters set */
  procpar: Param[];
}

/**
 * Converts FileList to object (procpar & fid need to exist).
 * Varian/Agilent store critical information in the procpar file.
 * @param files - File array or Files1D
 * @return Fid Object containing the parsed information from the fid directory
 */
export function convert1D(files: VarianFiles): Fid {
  const { fidB, procparB } = files;

  let fidBuffer = new IOBuffer(fidB);
  setEndianFromValue(fidBuffer); /* some files may use big endian */

  const fileHeader = new FileHeader(fidBuffer);
  const procpar = getParameters(procparB);

  /* acquisition time */
  const at = procpar.filter((par) => par.name === 'at')[0].values[0] as number;

  /* Create the time */
  const x = createXArray({
    from: 0,
    to: at,
    length: fileHeader.np / 2, //all data seen is complex datapoints
    distribution: 'uniform',
  });

  /* read the data block(s) for the fid file */
  // let fids: Block[]|Block = []; likely used for 2D
  let fid: Block;
  if (fileHeader.nBlocks === 1) {
    fid = new Block(fidBuffer, fileHeader);
  } else {
    throw new RangeError(
      `nBlocks is ${fileHeader.nBlocks}. If file is 2D use convert2D`,
    );
  }
  /* next code will be part of convert 2D instead
     if(fileHeader.nBlocks>1){
     for (let i = 0; i < fileHeader.nBlocks; i++) {
     fids.push(new Block(fidBuffer, fileHeader));
     }}
     else {}
   */

  return { meta: fileHeader, fid, procpar, x };
}
