import { fileListFromZip } from 'filelist-from';

import { convert1D, Fid } from './convert1D';

/** modification time in milliseconds */
export type mTimeMS = number;

/** File interface for files loaded into the program */
export interface File {
  name: string;
  webkitRelativePath: string;
  lastModified: Date | mTimeMS;
  size: number;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

/** Parses the Fid zipped files to an object representing all unzipped data
 * @param zip - array buffered zip file
 * @return conversion object
 * use either in browser or node js in any case, pass an ArrayBuffer.
 */
export async function convert1DFromZip(zip: ArrayBuffer): Promise<Fid> {
  let fidB: ArrayBuffer|undefined;
  let procparB: ArrayBuffer|undefined;

  const fileList: File[] = await fileListFromZip(zip);

  for (let fb of fileList) {
    let val = fb['name'].toLowerCase();
    switch (val) {
      case 'fid': {
        fidB = await fb.arrayBuffer();
        break;
      }
      case 'procpar': {
        procparB = await fb.arrayBuffer();
        break;
      }
      default:
        break;
    }
  }

  if (!fidB || !procparB) {
    /*check that files were found*/
    throw new RangeError("fidB and/or procparB not found in 'zip'");
  }

  return convert1D({
    fidB: fidB,
    procparB: procparB,
  });
}
