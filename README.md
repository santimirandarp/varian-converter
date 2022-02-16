# varian-converter

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Load and parse varian NMR native format.

## Installation

`$ npm i varian-converter`

## Usage

```js
import {join} from 'path';

import { convert1D } from 'varian-converter';

const result = convert1D(join(__dirname, "path/to/dir.fid")) 
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
