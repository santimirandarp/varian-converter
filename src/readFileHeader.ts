import { IOBuffer } from 'iobuffer';

import { AppDetails, FileStatus } from './utils';

/**
 * File Header parsing - First 32 bytes. The file header is the first block of the file
 * It stores relevant properties i.e size and number of other blocks etc.
 * @param buffer fid iobuffer i.e `new IOBuffer(buffer)`
 * @return Metadata
 */
export class FileHeader {
  /** number of data blocks in the file */
  public nBlocks: number;
  /** fids. number of FID "traces" per block (high resolution spectra with "nf=1" have one FID / "trace" per block, multi-echo FIDs such as imaging FIDs acquired in "compressed" mode may have multiple FIDs / "traces" per block) */
  public nTraces: number;
  /** number of (real, not complex) data points per "trace" (typically equal to the "np" parameter), */
  public np: number;
  /** number of bytes per "element"/point (precision). 2 for 16-bit data (dp='n'), 4 for 32-bit data (dp='y').  */
  public eBytes: number;
  /** trace bytes i.e., ebytes * np */
  public tBytes: number;
  /** block bytes: ebytes * np * nTraces + sizeof(blockHeader=28) */
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
    /** offset must be zero for analyzing FH */
    buffer.offset = 0;

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

  /** tell how the code is reading the data */
  public explain(): string {
    const { isSpectrum, isFloat32, isInt32 } = this.status;
    let known = [
      `There are ${this.nBlocks} data blocks in the file.`,
      `There are ${this.nBlockHeaders} block headers in the file ( >1 hypercomplex data ).`,
      `Each block contains ${this.nTraces} traces.`,
      `The data is a: ${(isSpectrum && 'spectrum') || 'FID'}`,
    ];

    const dataType = isFloat32 ? 'Float32' : isInt32 ? 'int32' : 'int16';

    known.push(`Datapoints are ${dataType}`);
    return known.join('\n');
  }
}
