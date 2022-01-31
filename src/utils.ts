/**
 * Status of the data stored. Used in block headers and file header.
 * The value of "status" is a flag.
 * @param status pass the code
 * @return status object with important information about the block data.
 */
export class Status {
  /** - 0x1 indicates the presence of data */
  public storesData: boolean;
  /** 0x2 would indicate "spectrum" (as opposed to "FID") */
  public isSpectrum: boolean;
  /** 0x4 indicates 32-bit (as opposed to 16-bit) data */
  public isInt32: boolean;
  /** 0x8 indicates (32-bit, IEEE format) floating point data (**then bit 2 is irrelevant**) */
  public isFloat: boolean;
  /** 0x10 indicates complex (as opposed to real) data */
  public isComplex: boolean;
  /** 0x20 indicates hypercomplex data (transformed nD data only) */
  public isHypercomplex: boolean;
  /** 0x40 is unused up to VnmrJ 1.1D */
  public constructor(status: number) {
    this.storesData = (status & 0x1) !== 0;
    this.isSpectrum = (status & 0x2) !== 0;
    this.isInt32 = (status & 0x4) !== 0;
    this.isFloat = (status & 0x8) !== 0;
    this.isComplex = (status & 0x10) !== 0;
    this.isHypercomplex = (status & 0x20) !== 0;
  }
}

/**
 * File status bits.
 * @extends [[`Status`]]
 * @param status pass the code
 * @return status object with important information about the block data.
 */
export class FileStatus extends Status {
  /** 0x80. Not sure what Acquisition Parameters means yet */
  public isAcqPar: boolean;
  /** 0x100. 0 means is first FT, 1 is second */
  public isSecondFT: boolean;
  /** 0x200. 0 regular, 1 transposed */
  public isTransformed: boolean;
  /** 0x800. np dimension is active */
  public isNp: boolean;
  /** 0x1000. nf dimension is active */
  public isNf: boolean;
  /** 0x2000. ni dimension is active */
  public isNi: boolean;
  /** 0x4000. n2 dimension is active */
  public isNi2: boolean;
  public constructor(status: number) {
    super(status);
    this.isAcqPar = (status & 0x80) !== 0;
    this.isSecondFT = (status & 0x100) !== 0;
    this.isTransformed = (status & 0x200) !== 0;
    this.isNp = (status & 0x800) !== 0;
    this.isNf = (status & 0x1000) !== 0;
    this.isNi = (status & 0x2000) !== 0;
    this.isNi2 = (status & 0x4000) !== 0;
  }
}
