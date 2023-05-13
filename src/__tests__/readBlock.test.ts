import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { Block } from '../readBlock';
import { FileHeader } from '../readFileHeader';
import { setEndianFromValue } from '../utils';

describe('read data blocks for different data types', () => {
  it('float32', () => {
    const float = readFileSync(join(__dirname, 'data/proton.fid/fid'));
    const bufferFloats = new IOBuffer(float);
    setEndianFromValue(bufferFloats);
    const fh = new FileHeader(bufferFloats);

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
    const dataBlocks = block.data;
    expect(dataBlocks).toHaveLength(block.index);
    expect(dataBlocks[0].re).toHaveLength(fh.np / 2);
    expect(dataBlocks[0].im).toHaveLength(fh.np / 2);
    expect(dataBlocks[0].re[0]).toBe(-214394.875);
  });

  it('int32', () => {
    const int = readFileSync(
      join(__dirname, 'data/2-Ketobutyric_acid_noesy.fid/fid'),
    );
    const bufferInt = new IOBuffer(int);
    setEndianFromValue(bufferInt);
    const fh = new FileHeader(bufferInt);

    bufferInt.offset = 32;
    const block = new Block(bufferInt, fh);
    expect(block).toMatchObject({
      scale: 0,
      status: {
        isInt32: true,
      },
      ctCount: 64,
    });
    expect(block.data).toHaveLength(block.index);
    expect(block.data[0].re).toHaveLength(fh.np / 2);
    expect(block.data[0].im).toHaveLength(fh.np / 2);
  });
});
