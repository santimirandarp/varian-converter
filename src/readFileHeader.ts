import { IOBuffer } from 'iobuffer';

import { AppDetails, FileStatus } from './utils';

// Definition taken from here:
// https://github.com/OpenVnmrJ/OpenVnmrJ/blob/master/src/vnmr/data.h

/**
 * File Header - First 32 bytes. The file header is the first block of the file.
 * @param buffer the fid file as iobuffer
 * @return Metadata
 */
export class FileHeader {
  public nBlocks: number; /** n of data blocks in the file */
  /** fids. n of fids per datablock ? */
  public nTraces: number;
  /** number of (real, not complex) data points per "trace" */
  public np: number;
  /** `np` length. 2 for 16-bit data, 4 for 32-bit data.  */
  public eBytes: number;
  /** trace bytes i.e., eBytes * np */
  public tBytes: number;
  /** block bytes: eBytes * np * nTraces + sizeof(blockHeader=28) */
  public bBytes: number;
  /** VnmrJ version ID
   * If zero may've been exported as 'Varian fid' from != software?
   */
  public version: AppDetails;
  /** status of the data */
  public status: FileStatus;
  /** If this is 2, there is hypercomplex data */
  public nBlockHeaders: number;
  public constructor(buffer: IOBuffer) {
    buffer.offset = 0; /** offset must be zero for analyzing FH */
    this.nBlocks = buffer.readInt32();
    this.nTraces = buffer.readInt32();
    this.np = buffer.readInt32();
    this.eBytes = buffer.readInt32();
    this.tBytes = buffer.readInt32();
    this.bBytes = buffer.readInt32();
    this.version = new AppDetails(buffer.readInt16());
    this.status = new FileStatus(buffer.readInt16());
    this.nBlockHeaders = buffer.readInt32();
  }
}
