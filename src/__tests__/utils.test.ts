import { FileStatus } from '../utils';

test('inspect bits', () => {
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
    isFloat: false,
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
