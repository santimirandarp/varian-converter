import {
  fileCollectionFromFileList,
  fileCollectionFromZip,
} from 'filelist-utils';
import { convert1D as cv } from '../src/index';

const form = document.getElementById('form') as HTMLFormElement;
const info = document.getElementById('info') as HTMLDivElement;

form.addEventListener('change', async (e) => {
  e.preventDefault();
  const input = e.target as HTMLInputElement;
  try {
    const fromDir =
      input.files &&
      input.id === 'dir' &&
      (await cv(await fileCollectionFromFileList(input.files)));
    const fromZip =
      input.files &&
      input.id === 'zippedFile' &&
      (await cv(await fileCollectionFromZip(input.files[0])));
    console.log('dir', fromDir, 'zip', fromZip);
    info.innerHTML = "parsed data was logged to browser's console";
  } catch (e) {
    console.error(e);
    info.innerHTML = e.message;
  }
});
