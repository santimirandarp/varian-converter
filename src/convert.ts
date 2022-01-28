import { IOBuffer } from 'iobuffer';

import { FileHeader } from './readFileHeader';

/**
 * varian-convert takes a `fid` input file as a buffer or array buffer
 * and retrieves an object storing all metadata, data and information from the
 * original `fid` file.
 */

export interface Fid {
  /** first block - header - of the fid file. Stores important file metadata.*/
  fileHeader: FileHeader;
}
/**
 * converts a fid file to JSON object
 *
 * @param data fid file
 * @return Object containing all the parsed information from the fid file
 */
export function convert(data: Buffer | ArrayBuffer): Fid {
  /* function will return the whole thing */
  const buffer = new IOBuffer(data);
  const fileHeader = new FileHeader(buffer);

  return { fileHeader };
}
