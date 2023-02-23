const { fileCollectionFromPath } = require('filelist-utils');
const { writeFileSync } = require('fs');
const { join } = require('path');

const { convert1D } = require('../lib/convert1D');
(async () => {
  const fileCollection = await fileCollectionFromPath(
    join(__dirname, '../src/__tests__/data/1H.fid'),
  );
  const { fid, x } = await convert1D(fileCollection);
  writeData({ x, y: fid.data[0].re}, 'data_re.json');
  writeData({ x, y: fid.data[0].im}, 'data_im.json');
})();

function writeData(data, name) {
  writeFileSync(
    join(__dirname, name),
    JSON.stringify(
      data,
      (key, value) => (ArrayBuffer.isView(value) ? Array.from(value) : value),
      2,
    ),
    'utf8',
  );
}