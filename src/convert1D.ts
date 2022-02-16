import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';
import { createFromToArray as createXArray } from 'ml-spectra-processing';

import { Block } from './readBlock';
import { FileHeader } from './readFileHeader';
import { Param, getParameters } from './readProcPar';
import { setEndianFromValue } from './utils';

/**
 * varian-convert takes a `fid` input file as a buffer or array buffer
 * and retrieves an object storing all metadata, data and information from the
 * original `fid` file.
 */
export interface Fid {
  /** first block - header - of the fid file. Stores important file metadata.*/
  meta: FileHeader;
  /** will be an array or a single fid, It also holds the header with fid metadata */
  // fids: Block[]|Block; this will likely be used for 2D
  fid: Block;
  /** To get the time values, we need to read procpar */
  time: Float64Array;
  /** always an array, there are hundreds of parameters set */
  procpar: Param[];
}

/**
 * Converts a fid **directory** to JSON object (procpar and fid need to exist).
 * The reason is that Varian/Agilent store critical information in the procpar file.
 * Those files are read disregarding the capitalization.
 * @param pathToFidDir - String with absolute path to the directory.
 * @return Fid Object containing the parsed information from the fid directory
 */
export function convert1D(pathToFidDir: string): Fid {
  /* filenames for files under the fid directory */
  const files = readdirSync(pathToFidDir);

  /* variables storing files are capitalized */
  let FID, PROCPAR;

  /* get fid and procpar */
  files.forEach((fname) => {
    const f = fname.toLowerCase();
    if (f === 'fid') FID = readFileSync(join(pathToFidDir, fname));
    else if (f === 'procpar') PROCPAR = readFileSync(join(pathToFidDir, fname));
  });

  /* Or throw an Error */
  if (!FID || !PROCPAR) {
    /*check that files were found*/
    throw new Error(`fid and/or procpar not found. Found ${files.join(',')}`);
  }

  let fidBuffer = new IOBuffer(FID);
  /* some files may use big endian */
  setEndianFromValue(fidBuffer);

  /* has many useful parameters, we use "np" i.e number of points next */
  const fileHeader = new FileHeader(fidBuffer);

  /* get experiment parameters */
  const procpar = getParameters(PROCPAR);
  /* extract acquisition time */
  const at = procpar.filter((par) => par.name === 'at')[0].values[0] as number;
  const tat = typeof at;
  if (tat !== 'number') {
    throw new Error(
      `'at' parameter in procpar must be type number. Found ${tat}`,
    );
  }
  /* and use it to create the time X array */
  const time = createXArray({
    from: 0,
    to: at,
    length: fileHeader.np,
    distribution: 'uniform',
  });

  /* read the data block(s) for the fid file */
  // let fids: Block[]|Block = []; likely used for 2D
  let fid: Block;
  if (fileHeader.nBlocks === 1) {
    fid = new Block(fidBuffer, fileHeader);
  } else {
    throw new Error(
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

  return { meta: fileHeader, fid, procpar, time };
}
