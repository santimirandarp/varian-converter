import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { FileHeader } from '../readFileHeader';

const file = readFileSync(join(__dirname, '../../data/proton.fid/fid'));
let buffer = new IOBuffer(file);

describe('read the file header', () => {
  it('cross validate values in the header', () => {
    const fileHeader = new FileHeader(buffer);
    // console.log(fileHeader);
    /* values we test */
    const { eBytes, np, tBytes, nTraces, bBytes, nBlockHeaders } = fileHeader;

    const numberOfBytesInTrace = eBytes * np;
    const numberOfBytesInDataBlock =
      numberOfBytesInTrace * nTraces + nBlockHeaders * 28;

    expect(numberOfBytesInTrace).toBe(tBytes);
    expect(numberOfBytesInDataBlock).toBe(bBytes);
  });
});
