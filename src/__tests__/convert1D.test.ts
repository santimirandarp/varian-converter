import { readFileSync } from 'fs';
import { join } from 'path';

import { convert1DFromDir } from '../convert1DFromDir';
import { convert1DFromZip } from '../convert1DFromZip';

describe('convert fid file for protons', () => {
  it('proton.fid', () => {
    const base = join(__dirname, '../../data/proton.fid');
    const result = convert1DFromDir(base);
    expect(Object.keys(result.meta)).toHaveLength(9);
    expect(Object.keys(result.fid)).toHaveLength(10);
    expect(result).toMatchSnapshot();
  });
  it('proton.fid.zip', async () => {
    const ab = readFileSync(join(__dirname, '../../data/proton.zip'));
    const result = await convert1DFromZip(ab);
    expect(Object.keys(result.meta)).toHaveLength(9);
    expect(Object.keys(result.fid)).toHaveLength(10);
    expect(result).toMatchSnapshot();
  });

  it('2D zipped file', async () => {
    const ab = readFileSync(join(__dirname, '../../data/gDQCOSY.fid.zip'));
    await convert1DFromZip(ab).catch((e) =>
      expect(e.message).toMatch('nBlocks is 400. If file is 2D use convert2D'),
    );
  });
});
