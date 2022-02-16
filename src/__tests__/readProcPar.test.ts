import { readFileSync as rfs } from 'fs';
import { join } from 'path';

import { getParameters } from '../readProcPar';

const procpar = rfs(join(__dirname, '../../data/proton.fid/procpar'));

test('parsed procpar', () => {
  /* test if extracts all params */
  const result = getParameters(procpar);
  const nOfParams = 499;
  expect(result).toHaveLength(nOfParams);

  /* any param has at least 13 keys */
  const randomParam = result[Math.floor(Math.random() * nOfParams)]; /* 0-? */
  const rPKeys = Object.keys(randomParam);
  expect(rPKeys.length).toBeGreaterThanOrEqual(13);

  /* test a single parameter value */
  expect(result[1]).toHaveProperty('name', 'dmfwet');
});
