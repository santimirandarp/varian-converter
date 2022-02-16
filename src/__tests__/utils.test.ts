import { readFileSync } from 'fs';
import { join } from 'path';

import { IOBuffer } from 'iobuffer';

import { setEndianFromValue, FileStatus, Lines } from '../utils';

const fid = readFileSync(join(__dirname, '../../data/proton.fid/fid'));
const procPar = readFileSync(join(__dirname, '../../data/proton.fid/procpar'));

const fidBuffer = new IOBuffer(fid);

test('Read File Status Bits', () => {
  /*
   * to see how bits are inspected, just invent
   * a number and check the props.
   */

  const status = new FileStatus(0b00000110010101);
  /* the number means: stores data, in int32 form,
and it is complex, etc */
  expect(status).toMatchObject({
    storesData: true,
    isSpectrum: false,
    isInt32: true,
    isFloat32: false,
    isComplex: true,
    isHypercomplex: false,
    isAcqPar: true,
    isSecondFT: true,
    isTransformed: false,
    isNp: false,
    isNf: false,
    isNi: false,
    isNi2: false,
  });
});

test('Infer endianness from values', () => {
  const initOffset = fidBuffer.offset;

  /* uses np value to set the buffer's endian */
  const report = setEndianFromValue(fidBuffer);

  expect(report).toBe('BE');

  expect(fidBuffer.isBigEndian()).toBe(true);

  /* don't want to change the buffer offset */
  const newOffset = fidBuffer.offset;
  expect(initOffset).toBe(newOffset);
});

test('Read NMR Procedure Parameters Lines', () => {
  /* pass the procpar file as a buffer object */
  const lines = new Lines(procPar, { offset: 0, eol: '\n' });
  /* check that it gets the basic set up right */
  expect(lines).toHaveLength(1543);
  expect(lines.offset).toBe(0);
  expect(lines.eol).toBe('\n');

  /* use it to read fourth line */
  lines.offset = 3;
  const fL = lines.readLine();
  expect(fL.split(' ')[0]).toBe('dmfwet');
  expect(lines.offset).toBe(4);
});
