import React from 'react';
import { ActiveZone } from './ActiveZone';
import { parseDir, parseZip } from './parseInput';

function App() {
  const zippedFileProps = {
    text: 'Browse for a zipped file',
    getData: parseZip,
    type: 'file',
    id: 'zip',
    name: 'zip',
    accept: '.zip',
  };
  const dirProps = {
    text: 'Browse for a directory',
    getData: parseDir,
    type: 'file',
    id: 'dir',
    name: 'dir',
    webkitdirectory: '',
    directory: '',
  };
  return (
    <>
      <h1>1D Spectra</h1>
      <div className="inputArea">
        <ActiveZone {...zippedFileProps} />
      </div>
      <div className="inputArea">
        <ActiveZone {...dirProps} />
      </div>
      <p id="info"></p>
    </>
  );
}

export default App;
