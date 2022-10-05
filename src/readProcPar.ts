import { IOBuffer } from 'iobuffer';

import { Lined } from './utils';
/**
 * Read the parameter's first line.
 * Parameters are groups of lines, the first line
 * is like a header, and contains data used to parse next lines
 * Definition is here
 * [OpenVnmrJ][init.h]
 * @param lineIn - header line / first line
 */
export class ParamHeader {
  /** parameter name */
  public name: string;
  public subType: number;
  /** 0 undefined, 1 for real, 2 for string
    1 and 2 may be arrays
   */
  public basicType: number;
  /** Maximum value for this current parameter */
  public maxValue: number;
  /** Minimum value for this current parameter */
  public minValue: number;
  /** Step size value for this current parameter */
  public stepSize: number;
  public gGroup: number;
  public dGroup: number;
  public protection: number;
  public active: number;
  public intptr: number;

  public constructor(lineIn: string) {
    const line = lineIn.split(' ');
    this.name = line[0];
    this.subType = parseInt(line[1], 10);
    this.basicType = parseInt(line[2], 10);
    this.maxValue = parseFloat(line[3]);
    this.minValue = parseFloat(line[4]);
    this.stepSize = parseFloat(line[5]);
    this.gGroup = parseInt(line[6], 10);
    this.dGroup = parseInt(line[7], 10);
    this.protection = parseInt(line[8], 10);
    this.active = parseInt(line[9], 10);
    this.intptr = parseInt(line[10], 10);
  }
}

/* represents a experiment parameter (a setting that is constant in the exp) */
export interface Param extends ParamHeader {
  /** Values from second Line (but can be multi line) */
  values: string[] | number[];
  /** Values from 'third' Line */
  enumerable: number;
  /** Optional val from 'third' Line */
  enumerables: string[];
}

/** Get parameters from the procpar file
 * @param io - io buffer instance
 * @returns array of parameter objects stored in file
 */
export function getParameters(io: IOBuffer): Param[] {
  /*
     Each parameter is thought as 3 blocks:
     ```
     header
     firstblock
     secondblock
     ```
     header and SB are single lines.
     FB could be multiple lines.
   */
  let params: Param[] = [];
  let lines = new Lined(io.readChars(io.length));
  /*split file by lines, store in array*/

  while (lines.index < lines.length - 1) {
    /* array of vals for current parameter.*/
    let values: number[] | string[] = [];

    /* enumerables are other values from the last block */
    let enumerables: string[] = [];

    const header = new ParamHeader(lines.readLine()); /* index is now 1 */

    /* 1st block may be multiline */
    const line2 = lines.readLine(); /*index 2*/
    if (header.basicType === 0) {
      // basicType=0 leaves values=[ ]
    } else if (header.basicType === 1) {
      /* real num, single line */

      const valuesRaw = line2.split(' ').slice(1); //0 is numOfLines
      values = valuesRaw.map((n) => parseFloat(n));
    } else if (header.basicType === 2) {
      /* string */
      values = line2.split('"').slice(1, 2); /* split on "s */
      let numOfLines = parseInt(line2.split(' ')[0], 10);
      /* strings may have multiple lines */
      while (numOfLines > 1) {
        values.push(lines.readLine().split('"')[1]);
        numOfLines--;
        /* if line 2 has NOF=3, we read 2 more i.e NOF=3, NOF=2.
           First (line2) was read before */
      }
    }

    /* second block stores enumerables */
    const line3 = lines.readLine(); /* last line */

    /* How many "p1" "p2" "p3" */
    const enumerable = parseInt(line3.split(' ')[0], 10);

    if (enumerable !== 0) {
      /* if 0, it is [] */
      if (header.basicType === 1) {
        // real n
        enumerables = line3.split(' ').slice(1);
      } else if (header.basicType === 2) {
        // strings
        /* if "", split " is [','',']. we retain the data in between '' */
        enumerables = line3.split('"').filter((el, idx) => idx % 2 === 1);
      }
    }
    params.push({ ...header, values, enumerable, enumerables });
  }
  return params;
}
/**
 * [init.h]:https://github.com/OpenVnmrJ/OpenVnmrJ/blob/master/src/vnmr/init.h#L16
 */
