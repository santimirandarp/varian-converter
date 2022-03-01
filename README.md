# varian-converter

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse varian NMR native format in JS.

## Installation

`npm i varian-converter filelist-from`

## Example of use in Browser

The user may upload files using an `<input>` element, and hand those to varian-convert. This returns an object representing all the parsed data (see the [result blueprint][#Blueprint]).

The `index.html`
```html
<!DOCTYPE html>
<html>
<input type='file' webkitdirectory mozdirectory directory placeholder='load files...'/>
<script src="./bundle.js"></script>
</html>
```
Notice `main.js` or `main.ts` has to be bundled `bundle.js`.

* JS for _zipped_ files: `main.js` 
```javascript
import {join} from 'path';
import {fileListFromZip as fromZip} from 'filelist-from';
import { convert1D as cv } from 'varian-converter';

const input = document.getElementById('input');
input.onchange = async function (){
 const filesList = await fromZip(input.files);
 console.log(cv(fileList));
 //do stuff
 return;
}
```
Or a standard _directory_ `<directory>.fid`:
```
import {join} from 'path';
import { convert1D as cv } from 'varian-converter';

const input = document.getElementById('input');
input.onchange = async function (){
 const fileList = input.files;
 console.log(cv(fileList));
 return;
}
```
## NodeJS

In Node we have access to the system files through the filesystem module (loaded in `fromPath`). Instead of the event system we use `readFileSync`:

```
import {join} from 'path';
import {readFileSync} from 'fs';
import {fileListFromZip as fromZip} from 'filelist-from';
import { convert1D as cv } from 'varian-converter';

const zipBuffer = readFileSync("path/to/file.zip");
fromZip(zipBuffer).then(r=>console.log(cv(fileList)))
```

If we prefer to load the `<directory>.fid` (no compression), we can also do it:

```javascript
import {join} from 'path';
import {fileListFromPath as fromPath} from 'filelist-from';
import { convert1D as cv } from 'varian-converter';

const fileList = fromPath("path/to/dir.fid");
const result = cv(fileList);
```

## Blueprint
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
