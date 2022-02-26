import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { convert1D, Fid } from './convert1D';

/** Parses the Fid directory files into an object
 * @param pathToFidDir - absolute path
 * @return conversion object
 * only for node js usage
 */
export function convert1DFromDir(pathToFidDir: string): Fid {
  const files = readdirSync(pathToFidDir);

  let fidB: ArrayBuffer | undefined;
  let procparB: ArrayBuffer | undefined;

  /* set fid and procpar */
  for (let fname of files) {
    const f = fname.toLowerCase();
    if (f === 'fid') {fidB = readFileSync(join(pathToFidDir, fname));}
    else if (f === 'procpar')
      {procparB = readFileSync(join(pathToFidDir, fname));}
  }

  if (!fidB || !procparB) {
    /*check that files were found*/
    throw new RangeError(
      `fid and/or procpar not found. Found ${files.join(',')}`,
    );
  }
  return convert1D({
    fidB,
    procparB,
  });
}
