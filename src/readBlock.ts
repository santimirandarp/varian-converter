import { IOBuffer } from 'iobuffer';

import { FileHeader } from './readFileHeader';
import { BlockStatus } from './utils';

/**
 * Mode of data in block
 * Unused bits: `[3, 7, 11, 15]`
 * @param mode flag with mode information
 * @return object storing all flags
 */
export class ModeOfDataInBlock {
  public npPhMode: boolean;
  public npAvMode: boolean;
  public npPwrMode: boolean;
  public nfPhMode: boolean;
  public nfAvMode: boolean;
  public nfPwrMode: boolean;
  public niPhMode: boolean;
  public niAvMode: boolean;
  public niPwrMode: boolean;
  public ni2PhMode: boolean;
  public ni2AvMode: boolean;
  public ni2PwrMode: boolean;
  public niPaMode: boolean;
  public ni2PaMode: boolean;
  public constructor(mode: number) {
    this.npPhMode = (mode & 0x1) !== 0;
    this.npAvMode = (mode & 0x2) !== 0;
    this.npPwrMode = (mode & 0x4) !== 0;
    this.nfPhMode = (mode & 0x10) !== 0;
    this.nfAvMode = (mode & 0x20) !== 0;
    this.nfPwrMode = (mode & 0x40) !== 0;
    this.niPhMode = (mode & 0x100) !== 0;
    this.niAvMode = (mode & 0x200) !== 0;
    this.niPwrMode = (mode & 0x400) !== 0;
    this.ni2PhMode = (mode & 0x8) !== 0;
    this.ni2AvMode = (mode & 0x100) !== 0;
    this.ni2PwrMode = (mode & 0x2000) !== 0;
    this.niPaMode = (mode & 0x4000) !== 0;
    this.ni2PaMode = (mode & 0x8000) !== 0;
  }
}

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
  public data: BodyData[] | BodyData;
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

export type BodyData = Float32Array | Int32Array | Int16Array;

/**
 * Parses the particular block of data  using file header information
 * @param buffer - IOBuffer with the data.
 * @param fileHeader - file header information.
 * @return array of block or single block
 */
export function getBlockBody(
  buffer: IOBuffer,
  fileHeader: FileHeader,
): BodyData[] | BodyData {
  /*[[]] if traces >1, [] if traces=1*/
  const {
    np,
    nTraces,
    status: { isFloat32, isInt32 },
  } = fileHeader;

  let traces: BodyData[] = [];

  if (isFloat32) {
    for (let t = 0; t < nTraces; t++) {
      let data = new Float32Array(np);
      for (let i = 0; i < np; i++) {
        data[i] = buffer.readFloat32();
      }
      traces[t] = data;
    }
  } else if (isInt32) {
    for (let t = 0; t < nTraces; t++) {
      let data = new Int32Array(np);
      for (let i = 0; i < np; i++) {
        data[i] = buffer.readInt32();
      }
      traces[t] = data;
    }
  } else {
    /* isInt16 */
    for (let t = 0; t < nTraces; t++) {
      let data = new Int16Array(np);
      for (let i = 0; i < np; i++) {
        data[i] = buffer.readInt16();
      }
      traces[t] = data;
    }
  }
  /* Simplify output for a single spectra (common case) */
  if (nTraces === 1) return traces[0];
  return traces;
}
