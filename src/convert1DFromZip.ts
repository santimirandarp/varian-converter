import { fileListFromZip } from 'filelist-from';

import { convert1D, Fid } from './convert1D';

/** Parses the Fid zipped files to an object representing all unzipped data
 * @param zip - array buffered zip file
 * @return conversion object
 * use either in browser or node js in any case, pass an ArrayBuffer.
 */
type FileSubset = Omit<File, 'slice' | 'stream' | 'type'>;

export async function convert1DFromZip(zip: ArrayBuffer): Promise<Fid> {
  let fidB: ArrayBuffer | undefined;
  let procparB: ArrayBuffer | undefined;

  const fileList: FileSubset[] = await fileListFromZip(zip);

  for (let fb of fileList) {
    let val = fb.name.toLowerCase();
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
