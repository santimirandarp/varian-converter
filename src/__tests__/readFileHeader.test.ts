import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { FileHeader } from '../readFileHeader';
import { setEndianFromValue } from '../utils';

const file = readFileSync(join(__dirname, '../../data/proton.fid/fid'));
let buffer = new IOBuffer(file);

test('cross check values in header', () => {
  setEndianFromValue(buffer);
  const fh = new FileHeader(buffer);

  const numberOfBytesInTrace = fh.eBytes * fh.np;
  const numberOfBytesInDataBlock =
    numberOfBytesInTrace * fh.nTraces + fh.nBlockHeaders * 28;

  //check some of the props at random
  expect(numberOfBytesInTrace).toBe(fh.tBytes);
  expect(numberOfBytesInDataBlock).toBe(fh.bBytes);
  expect(fh.status.isFloat32).toBe(true);
  //and for the test not to take too long, check the rest using snapshot
  expect(fh).toMatchSnapshot();
});
