import { readFileSync } from 'fs';
import { join } from 'path';

import {
  fileListFromZip as fromZip,
  fileListFromPath as fromPath,
} from 'filelist-from';

import { convert1D } from '../convert1D';

describe('convert fid directory', () => {
  //first non zipped directory
  it('proton.fid', async () => {
    //get the fid directory
    const base = join(__dirname, '../../data/proton.fid');
    // convert the filelist returned by fromPath
    const result = await convert1D(fromPath(base));
    // test some properties of the main object
    expect(Object.keys(result.meta)).toHaveLength(9);
    expect(Object.keys(result.fid)).toHaveLength(10);
    expect(result.procpar).toHaveLength(499);
    expect(result.x).toHaveLength(result.meta.np / 2);
    // Snapshot
    expect(result).toMatchSnapshot();
  });

  //missing fid
  it('missing.fid', async () => {
    //get the fid
    const base = join(__dirname, '../../data/missing.fid');
    // convert the filelist returned by fromPath
    // test some properties of the main object
    await convert1D(fromPath(base)).catch((e) =>
      expect(e.message).toMatch('fidB and/or '),
    );
  });

  //zipped directory
  it('proton.fid.zip', async () => {
    const ab = readFileSync(join(__dirname, '../../data/proton.zip'));
    const result = await convert1D(await fromZip(ab));
    expect(result).toMatchSnapshot();
  });

  //2D file
  it('2D zipped file', async () => {
    const ab = readFileSync(join(__dirname, '../../data/gDQCOSY.zip'));
    await convert1D(await fromZip(ab)).catch((e) =>
      expect(e.message).toMatch('nBlocks is 400. '),
    );
  });
});
