import { IOBuffer } from 'iobuffer';

import { FileStatus } from './utils';

/**
 * File Header parsing - First 32 bytes. The file header is the first block of the file
 * It stores relevant properties i.e size and number of other blocks etc.
 * @param buffer fid iobuffer i.e `new IOBuffer(buffer)`
 * @return Metadata
 */
export class FileHeader {
  /** number of data blocks in the file */
  public nBlocks: number;
  /** number of FID "traces" per block (high resolution spectra with "nf=1" have one FID / "trace" per block, multi-echo FIDs such as imaging FIDs acquired in "compressed" mode may have multiple FIDs / "traces" per block) */
  public nTraces: number;
  /** number of (real, not complex) meaningful (data) points per "trace" (typically equal to the "np" parameter), */
  public np: number;
  /** number of bytes per "element"/point (precision). 2 for 16-bit data (dp='n'), 4 for 32-bit data (dp='y').  */
  public eBytes: number;
  /** trace bytes i.e., fheader.ebytes * fheader.np */
  public tBytes: number;
  /** block bytes, in "C speak": fheader.ebytes * fheader.np * fheader.ntraces +
          sizeof(struct blockHeader) i.e 28B */
  public bBytes: number;
  /** VnmrJ version ID (you may find this set to zero - it's not really used in our software); */
  public versionId: number;
  /** status of the data */
  public status: FileStatus;
  public nBlockHeaders: number;
  public constructor(buffer: IOBuffer) {
    /* Set big endian to read numbers the other way around */
    buffer.setBigEndian();

    /* make sure the offset is 0 to read the file header */
    buffer.offset = 0;

    this.nBlocks = buffer.readUint32();
    this.nTraces = buffer.readUint32();
    this.np = buffer.readUint32();
    this.eBytes = buffer.readUint32();
    this.tBytes = buffer.readUint32();
    this.bBytes = buffer.readUint32();
    this.versionId = buffer.readUint16();
    this.status = new FileStatus(buffer.readUint16());
    this.nBlockHeaders = buffer.readUint32();
  }
}
