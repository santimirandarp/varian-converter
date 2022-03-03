import { PartialFileList } from 'filelist-from';
import { IOBuffer } from 'iobuffer';
import { createFromToArray as createXArray } from 'ml-spectra-processing';

import { Block } from './readBlock';
import { FileHeader } from './readFileHeader';
import { Param, getParameters } from './readProcPar';
import { setEndianFromValue } from './utils';

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
 * @param files - `FileList` Or a subset like `PartialFileList`
 * @return Fid Object containing the parsed information from the fid directory
 */
export async function convert1D(
  fileList: PartialFileList | FileList,
): Promise<Fid> {
  let fidB: ArrayBuffer | undefined;
  let procparB: ArrayBuffer | undefined;

  for (let fb of fileList) {
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
    /*check that files were found*/
    throw new RangeError("fidB and/or procparB not found in 'zip'");
  }

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
