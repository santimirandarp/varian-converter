import { IOBuffer } from 'iobuffer';

import { setEndianFromValue, FileStatus, Lined } from '../utils';

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

test('Detect Endianness', () => {
  let fid1 = new IOBuffer(new Int32Array([400, 500, 40, 4]));
  let fid2 = new IOBuffer(new Int32Array([400, 500, 40, 2 ** 25]));

  fid1.offset = 2; //unexpected, but the function will fix it

  const r1 = setEndianFromValue(fid1);
  expect(r1).toBe('LE');
  expect(fid1.offset).toBe(2);
  expect(fid1.isLittleEndian()).toBe(true);

  const r2 = setEndianFromValue(fid2);
  expect(r2).toBe('BE');
  expect(fid2.offset).toBe(0);
  expect(fid2.isLittleEndian()).toBe(false);
});

test('read single and multiple lines', () => {
  /* pass the procpar file as a buffer object */
  const testString = `Lorem Ipsum is simply dummy text of\n the printing and \ntypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown \n printer took a galley of type and scrambled it to make a type specimen book.`;
  const lines = new Lined(testString);

  /* check that it gets the basic set up right */
  expect(lines).toHaveLength(4);
  expect(lines.index).toBe(0);
  expect(lines.eol).toBe('\n');

  /* use it to read fourth line */
  lines.index = 3;
  expect(lines.readLine()).toMatch(' printer took a galley');
  expect(lines.index).toBe(4);

  expect(() => lines.readLine()).toThrow('a');
});
