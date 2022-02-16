import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { FileHeader } from '../readFileHeader';
import { setEndianFromValue } from '../utils';

const file = readFileSync(join(__dirname, '../../data/proton.fid/fid'));
let buffer = new IOBuffer(file);

describe('read the file header', () => {
  it('cross check values in header', () => {
    setEndianFromValue(buffer);
    const fileHeader = new FileHeader(buffer);
    const {
      eBytes,
      np,
      tBytes,
      nTraces,
      bBytes,
      nBlockHeaders,
      status: { isFloat32 },
    } = fileHeader;

    const numberOfBytesInTrace = eBytes * np;
    const numberOfBytesInDataBlock =
      numberOfBytesInTrace * nTraces + nBlockHeaders * 28;

    expect(numberOfBytesInTrace).toBe(tBytes);
    expect(numberOfBytesInDataBlock).toBe(bBytes);
    expect(isFloat32).toBe(true);
    expect(fileHeader.explain()).toBeDefined();
  });
});
