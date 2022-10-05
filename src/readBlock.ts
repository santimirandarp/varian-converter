import { IOBuffer } from 'iobuffer';

import { FileHeader } from './readFileHeader';
import { ModeOfDataInBlock, BlockStatus } from './utils';

/** Read the block header (28B) and body */
export class Block {
  /** tldr:scaling factor. "scale" is the number of downscaling operations (non-circular, bit-wise
    right-shifts, or divisions by 2) while accumulating data (particularly when
    acquiring with a very large "nt" and "dp='n'") in the given block (see the
    article "How Does the Autogain Work?" in Varian NMR News 1999-09-11);
   */
  public scale: number;
  /** "status" in FIDs is usually the same as in the file header, */
  public status: BlockStatus;
  /** block index */
  public index: number;
  /** mode in data block */
  public mode: ModeOfDataInBlock;
  /** "ctcount" is the value of "ct" for the associated FID block; */
  public ctCount: number;
  /* f2 (2D-f1) left phase in phasefile */
  public lpVal: number;
  /* f2 (2D-f1) right phase in phasefile */
  public rpVal: number;
  /**"lvl" and "tlt" are used to store the d.c. offsets (as determined via the
    noise sampling prior to acquisition) in channels A and B in the case of
    "nt=1", see Varian NMR News 2001-02-02. */
  public lvl: number; /* level drift correction */
  public tlt: number; /* tilt drift correction */
  public data: BodyData[]; /* normally will have 1 element, unless multi trace */
  public constructor(
    buffer: IOBuffer,
    fileHeader: FileHeader,
    offset?: number,
  ) {
    /* set offset if defined */
    if (offset) buffer.offset = offset;

    this.scale = buffer.readInt16();
    this.status = new BlockStatus(buffer.readInt16());
    this.index = buffer.readInt16();
    this.mode = new ModeOfDataInBlock(buffer.readInt16());
    this.ctCount = buffer.readInt32();
    this.lpVal = buffer.readFloat32();
    this.rpVal = buffer.readFloat32();
    this.lvl = buffer.readFloat32();
    this.tlt = buffer.readFloat32();
    this.data = getBlockBody(buffer, fileHeader);
  }
}
/**
 * The data points seem to be always be imaginary for fids
 */
export interface BodyData {
  re: Float32Array | Int32Array | Int16Array;
  im: Float32Array | Int32Array | Int16Array;
}

/**
 * Parses the particular block of data  using file header information
 * @param buffer - IOBuffer with the data.
 * @param fileHeader - file header information.
 * @return array of block or single block
 */
export function getBlockBody(
  buffer: IOBuffer,
  fileHeader: FileHeader,
): BodyData[] {
  //body data has just one element if `nTraces===1`

  const {
    np,
    nTraces,
    status: { isFloat32, isInt32 },
  } = fileHeader;

  if (isFloat32) {
    //array is overwritten for each trace
    return dataReader(buffer, nTraces, np, 'readFloat32');
  } else if (isInt32) {
    //array is overwritten for each trace
    return dataReader(buffer, nTraces, np, 'readInt32');
  } else {
    //int16
    return dataReader(buffer, nTraces, np, 'readInt16');
  }
}

/**
 * reduces code duplication
 * @param buffer, the data
 * @param nTraces - number of fids
 * @param np - number of points: real + imaginary
 * @param readType - to select from IOBuffer
 */
function dataReader(
  buffer: IOBuffer,
  nTraces: number,
  np: number,
  readType: 'readInt16' | 'readInt32' | 'readFloat32',
) {
  let fids: BodyData[] = [];

  let fid;
  if (readType === 'readFloat32') {
    fid = { re: new Float32Array(np / 2), im: new Float32Array(np / 2) };
  } else if (readType === 'readInt32') {
    fid = { re: new Int32Array(np / 2), im: new Int32Array(np / 2) };
  } else {
    fid = { re: new Int16Array(np / 2), im: new Int16Array(np / 2) };
  }

  //`data` array is overwritten internally for each trace, as they all have same number of
  // datapoints np/2, then we define it only once

  for (let t = 0; t < nTraces; t++) {
    for (let i = 0; i < np; i += 2) {
      fid.re[i >>> 1] = buffer[readType]();
      fid.im[i >>> 1] = buffer[readType]();
    }
    fids[t] = fid;
  }

  return fids;
}
