import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { BodyData, Block } from '../readBlock';
import { FileHeader } from '../readFileHeader';
import { setEndianFromValue } from '../utils';

describe('read data blocks for different data types', () => {
  it('float32', () => {
    const float = readFileSync(join(__dirname, '../../data/proton.fid/fid'));
    let bufferFloats = new IOBuffer(float);
    setEndianFromValue(bufferFloats);
    let fh = new FileHeader(bufferFloats);

    bufferFloats.offset = 32;
    const block = new Block(bufferFloats, fh);
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

  it('int32', () => {
    const int = readFileSync(
      join(__dirname, '../../data/2-Ketobutyric_acid_noesy.fid/fid'),
    );
    let bufferInt = new IOBuffer(int);
    setEndianFromValue(bufferInt);
    let fh = new FileHeader(bufferInt);

    bufferInt.offset = 32;
    const block = new Block(bufferInt, fh);
    expect(block).toMatchObject({
      scale: 0,
      status: {
        isInt32: true,
      },
      ctCount: 64,
    });
    const data = block.data as BodyData;
    expect(data.re).toHaveLength(fh.np / 2);
    expect(data.im).toHaveLength(fh.np / 2);
  });
});
