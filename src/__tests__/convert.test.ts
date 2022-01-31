import { readFileSync } from 'fs';
import { join } from 'path';

import { convert } from '../convert';

describe('convert fid file for protons', () => {
  it('proton.fid', () => {
    const fid = readFileSync(join(__dirname, '../../data/proton.fid/fid'));
    const result = convert(fid);
    expect(Object.keys(result.fileHeader)).toHaveLength(9);
    expect(result).toMatchSnapshot();
    // we have another parser that should give a pretty similar result
  });
});
