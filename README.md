# varian-converter

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse varian NMR native format in JS.

It returns an object representing all the parsed data (see the [result blueprint](#blueprint)).

## Installation

`npm i varian-converter filelist-from`

## Single Directory as FileList

The `convert1D` function expects a FileList. FileList is returned by the browser when uploading a directory, and by jsZip library when Zips ([Browser Example](#example-of-use-in-browser)). To be use in NodeJS see [NodeJS Example](#example-of-use-in-nodejs). There are normally 4 files in a 1D fid directory:
1. fid
2. procpar
3. text
4. log

\1. and 2. must exist or `convert1D` will error out.

For passing multiple FIDs the `convert1D` should run in a loop, each time passing a FileList corresponding to the 1D (_fid_ and _procpar_ must exist), pushing the result object elsewhere.

## Example of use in Browser

The user may upload:

* a zip file with the fid directory compressed
* a fid directory 


Check the [example folder](https://github.com/cheminfo/varian-converter/example) to see an example for the browser. The idea is to upload the files using `<input>` and it retrieves a FileList that can be handed to varian-converter.

## Example of use in NodeJS

In Node we have access to the system files through the filesystem module (loaded in `fromPath`). Instead of the onchange event system we use `readFileSync`:

```javascript
import {join} from 'path';
import {readFileSync} from 'fs';
import {fileListFromZip as fromZip} from 'filelist-from';
import { convert1D as cv } from 'varian-converter';

const zipBuffer = readFileSync(join(__dirname,"path/to/file.zip"));
fromZip(zipBuffer)
  .then(fileList=>cv(fileList))
  .then(result=>console.log(result))
  .catch(e=>console.log(e))
```

If we prefer to load the `<directory>.fid` (no compression), we can also do it:

```javascript
import {join} from 'path';
import {fileListFromPath as fromPath} from 'filelist-from';
import { convert1D as cv } from 'varian-converter';

const fileList = fromPath(join(__dirname,"path/to/dir.fid"))
cv(fileList)
  .then(result=>console.log(result))
  .catch(e=>console.log(e))
```

## Blueprint

`convert1D` returns an object with the following keys:

```javascript
{
  meta: <object fid metadata (number types, length in bytes etc)>,
  procpar: <object of experiment settings and params>,
  fid: {data:[],...} | [{data:[],..}, {data:[],..},...]
  x: <float64Array of time values>
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
