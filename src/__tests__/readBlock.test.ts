import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { BodyData, Block } from '../readBlock';
import { FileHeader } from '../readFileHeader';
import { setEndianFromValue } from '../utils';

const file = readFileSync(join(__dirname, '../../data/proton.fid/fid'));

let buffer = new IOBuffer(file);

setEndianFromValue(buffer);
let fh = new FileHeader(buffer);

test('read data block', () => {
  buffer.offset = 32;
  const block = new Block(buffer, fh);
  expect(block).toMatchObject({
    scale: 0,
    status: {
      storesData: true,
      isSpectrum: false,
      isFloat32: true,
    },
    index: 1,
    ctCount: 160,
  });
  const data = block.data as BodyData;
  expect(data.re).toHaveLength(fh.np / 2);
  expect(data.im).toHaveLength(fh.np / 2);
});
