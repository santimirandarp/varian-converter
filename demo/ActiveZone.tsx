import React, { useState } from 'react';
import { type Fid1D } from '../src';
import {
  Plot,
  LineSeries,
  useRectangularZoom,
  PlotController,
} from 'react-plot';
import { reimFFT, xyToXYObject } from 'ml-spectra-processing';

export function ActiveZone(props: InputProps) {
  const { getData, text, type, id, name, accept, ...otherProps } = props;
  const [experiment, setData] = useState<Fid1D | null>(null);
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newData = await getData(e);
    setData(newData);
  }
  return (
    <>
      <label htmlFor={id}>{text}</label>
      <input
        onChange={handleChange}
        type={type}
        id={id}
        name={name}
        {...otherProps}
      />
      {experiment && (
        <PlotController>
          <Varian1DPlot {...experiment} />
        </PlotController>
      )}
    </>
  );
}

/**
 * Very rough function to show the fftd spectra of a Varian 1D experiment
 * @param experiment
 * @returns
 */
function Varian1DPlot(experiment: Fid1D) {
  useRectangularZoom();
  const x = experiment.x;
  const fft = experiment.fid.data.map(({ re, im }) =>
    fft({ re: new Float64Array(re), im: new Float64Array(im) }),
  );
  const re = fft.map((value) => value.re);
  const im = fft.map((value) => value.im);
  const spectraRe = re.map((spectrum) => {
    return xyToXYObject({ x, y: new Float64Array(spectrum) });
  });
  const spectraIm = im.map((spectrum) => {
    return xyToXYObject({ x, y: new Float64Array(spectrum) });
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
      {spectraRe.map((spectrum, index: number) => {
        return (
          <div key={index}>
            <Plot key={'re'} width={500} height={500}>
              <LineSeries data={spectrum} />
            </Plot>
            <Plot key={'im'} width={500} height={500}>
              <LineSeries data={spectraIm[index]} />
            </Plot>
          </div>
        );
      })}
    </div>
  );
}
type InputProps = {
  text: string;
  getData: (e: React.ChangeEvent<HTMLInputElement>) => Promise<Fid1D | null>;
  type: string;
  id: string;
  name: string;
  accept?: string;
  webkitdirectory?: string;
  directory?: string;
};
