import {fileListFromZip} from 'filelist-utils';
import { convert1D as cv} from './lib-esm/convert1D';

const idir = document.getElementById("directory");
const ifile = document.getElementById("zip");

// run on directory upload
async function Dir(){
  console.log("loading directory..!")
    const fileList = await idir.files
    return (await cv(fileList));
}

idir.onchange = function (){
  Dir().then(r=>console.log(r)).catch(e=>console.log(e))
}
// run on zip file upload
async function Zip(){
  console.log("loading zip file..!")
    const fileList = await fileListFromZip(await
        ifile.files[0].arrayBuffer());
  return (await cv(await fileList))
}
ifile.onchange = function (){
  Zip().then(r=>console.log(r)).catch(e=>console.log(e))
}

