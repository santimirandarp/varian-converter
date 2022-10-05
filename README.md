# varian-converter

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse varian NMR native format.

The code currently parses 1-dimensional NMR only.

## Installation

`npm i varian-converter filelist-utils`

## Usage
The `convert1D` function expects a FileCollection. There are normally 4 files in a 1D fid directory:
1. fid
2. procpar
3. text
4. log

1 and 2 must exist or `convert1D` will error out.

`FileCollection`s are returned from the `filelist-utils` package which runs both in NodeJS and the
browser.


For passing multiple directories the `convert1D` should run in a loop, each time passing a FileCollection corresponding to the 1D (_fid_ and _procpar_ must exist), pushing the result object elsewhere.

### Use in Browser

The user may upload:

* a zip file with the fid directory compressed
* a fid directory

See the **example** folder.

### Use in NodeJS

* Compressed fid directory

```javascript
import { join } from 'path';
import { readFileSync } from 'fs';
// allows us to load a directory in NodeJS
import { fileCollectionFromZip } from 'filelist-utils';
import { convert1D as cv } from 'varian-converter';

const zipBuffer = readFileSync(join(__dirname,"path/to/compressed.fid.zip"));
fileCollectionFromZip(zipBuffer)
    .then(fileCollection=>cv(fileCollection))
    .then(result=>console.log(result))
    .catch(e=>console.log(e))
```

* Standard fid directory

```javascript
import { join } from 'path';
import { fileCollectionFromPath } from 'filelist-utils';
import { convert1D as cv } from 'varian-converter';

const fileCollection = fileCollectionFromPath(join(__dirname,"path/to/dir.fid"))
cv(fileCollection)
  .then(result=>console.log(result))
  .catch(e=>console.log(e))
```

## Output

`convert1D` returns an object with the signature

```text
{
  meta: Record<string,any>
  procpar: Record<string,any>
  fid: [data1, data2, data3..]
  x: Float64Array (time values)
}
```
## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/varian-converter.svg
[npm-url]: https://www.npmjs.com/package/varian-converter
[ci-image]: https://github.com/cheminfo/varian-converter/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/varian-converter/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/varian-converter.svg
[codecov-url]: https://codecov.io/gh/cheminfo/varian-converter
[download-image]: https://img.shields.io/npm/dm/varian-converter.svg
[download-url]: https://www.npmjs.com/package/varian-converter
