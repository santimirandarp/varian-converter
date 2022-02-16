import { join } from 'path';

import { convert1D } from '../convert1D';

describe('convert fid file for protons', () => {
  it('proton.fid', () => {
    const base = join(__dirname, '../../data/proton.fid');
    const result = convert1D(base);
    //    console.log(result.meta);
    expect(Object.keys(result.meta)).toHaveLength(9);
    expect(Object.keys(result.fid)).toHaveLength(10);
    expect(result).toMatchSnapshot();
  });
});
