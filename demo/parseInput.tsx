import { ChangeEvent } from 'react';
import {
  fileCollectionFromFileList,
  fileCollectionFromZip,
} from 'filelist-utils';
import { convert1D as cv } from '../src/index';

export async function parseDir(e: ChangeEvent<HTMLInputElement>) {
  e.preventDefault();
  const input = e.target as HTMLInputElement;
  const fromDir =
    input.files &&
    input.id === 'dir' &&
    (await cv(await fileCollectionFromFileList(input.files)));

  if (fromDir) return fromDir;
  else return null;
}

export async function parseZip(e: ChangeEvent<HTMLInputElement>) {
  e.preventDefault();
  const input = e.target as HTMLInputElement;
  const fromZip =
    input.files &&
    input.id === 'zip' &&
    (await cv(await fileCollectionFromZip(input.files[0])));
  console.log('parsed from zip', fromZip);
  if (fromZip) return fromZip;
  else return null;
}
