import { readFileSync } from 'fs';
import { join } from 'path';

import { fileCollectionFromZip, fileCollectionFromPath } from 'filelist-utils';

import { convert1D } from '../convert1D';

describe('convert fid directory', () => {
  it('proton.fid', async () => {
    const base = join(__dirname, 'data/proton.fid');
    const parsed = await convert1D(await fileCollectionFromPath(base));

    expect(Object.keys(parsed)).toHaveLength(4);
    expect(Object.keys(parsed.meta)).toHaveLength(9);
    expect(Object.keys(parsed.fid)).toHaveLength(10);
    expect(parsed.procpar).toHaveLength(499);
    expect(parsed.x).toHaveLength(parsed.meta.np / 2);
  });

  it('missing "fid" in dir should error out', async () => {
    //get the fid
    const base = join(__dirname, 'data/missing.fid');
    await convert1D(await fileCollectionFromPath(base)).catch((e) =>
      expect(e.message).toMatch('fid and procpar must exist'),
    );
  });

  //2D file
  it('2D zipped file', async () => {
    const ab = readFileSync(join(__dirname, 'data/gDQCOSY.zip'));
    await convert1D(await fileCollectionFromZip(ab)).catch((e) =>
      expect(e.message).toMatch('found nBlocks 400, but expected 1'),
    );
  });
});
