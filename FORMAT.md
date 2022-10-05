# Varian Native format

Varian/Agilent instruments store data under a directory ending in '.fid': 
* **fid**: fid binary data.
* **procpar**: text file. Sample information, instrument parameters (pulse width etc.)
* **text**: text file. Comments, notes text.
* **log**: text file. Error messages, acquisition data.

## Main pieces: fid & procpar
**fid** file stores experiment flags and 1D fid | 2D fid | spectral data; as integers or floating points. 

It is assumed in the scripts that the data:
* is always complex 
* holds fid as opposed to spectral data 

The reason is not finding descriptions or samples for those. This will need revision in the future.

> The actual FID data is typically stored as pairs floating-point numbers. The first represents the real part of a complex pair and the second represents the imaginary component.  

_VnmrJ User Programming Manual (chapter 5)._

**procpar** when a parameter is in both fid and procpar, choose the one from fid. That is what the data always corresponds to.

## Parse Fid: The bits map
The C header **data.h** is the map to interpret the binary code.

* Fileheader (first 32B): File Metadata: number of blocks, size of blocks etc. 
* BlockHeader (28B): Block Metadata.
* BlockBody: Float32|Int32|Int16.

### Blocks
* **1D NMR** Arrayed data files have the following structure:          
```
filehead  blockhead  blockdata  blockhead  blockdata ...  	
```								
For non arrayed FIDs there would be just one data block.

* **2D NMR** data files have the following structure:		
```
filehead  blockhead  blockhead2  blockdata ...		
```								

* **3D NMR** data files have the following structure:		
```
filehead  blockhead  blockhead2  blockhead2  blockdata ..	
```								
								
_All blocks (except the FH) within one file have exactly the same size_.
								

## Parse procpar
There is no easy single-header file for procpar.

Text file stores the user input information, instrument settings. The arrange of data is similar to:
```
Block1 |<name> <subType> <basicType> ...
       |<nOfLines> <values>
       |lines 'children' of prev line
       |optional line
Block2 |<name> <subType> <basicType> ...
       |<nOfLines> <values>
       |lines 'children' of prev line
```

The first Block line is like a header & helps to parse the rest of the block.

## Some Parameters
Get the parameters from the array: `arr.filter(p=> p.name=='<name>')`. These are a few `name`s, alphabetically:

* **apptype**, example std1D is a standard 1D measurement.
* **at**, Acquisition time (length of time we receive signal from the sample after exciting it with
  the pulse, this will correspond with the spectra.).
* **comment**
* **explist**, from the list of pre-set experiments (PROTON, CARBON...).
* **emailaddr**
* **file**
* **np** number of real datapoints (not imaginary/complex) sampled by the ADC (analog-digital converter) from the analog signal. Normally the higher the np, the higher the resolution is (for a given fid). A typical value is ~10microseconds.
* **operator** (use that did the nmr)
* **pw**: pulse width (amount of time pulse is applied per cycle).
* **pw90**: amount of time to rotate the bulk magnetization in Z 90 degrees (to XY plane) from the applied B. Normally less is used, i.e they rotate ~25-45 degrees.
* **tpwr**: intensity of the pulse.
* **sample**, **samplename**.
* **seqfil**: pulse sequence is a string for a pre-set or user defined pulse sequence. Sequences include incl. tlength we irradiate sample at resonance frequency, acquisition time, how many pulses per cycle, etc. A common one for 1H and 13C is the simple 1 Pulse named **s2pul** i.e `seqfil:"s2pul"`.
* **sfreq**: spectrometer frequency in MHz, it is the Pulse Frequency. Should be equal to the
  resonance frequency (this in turn depends in the external B because of zeeman effect) of the
  particular atom.
* **solvent**
* **temp**
* **time\_complete** (also time\_saved, time\_run...)
* **username**

## A few notes from authors (extracted from `./docs` folder)

(...) to determine the data structure and type clearly it is far safer for importing software to look at the binary data file and its headers, rather than trying to extract this information from the parameter file.

See [OpenVnmrJ variables.h](https://github.com/OpenVnmrJ/OpenVnmrJ/blob/master/src/vnmr/variables.h) for info on how to parse this file.

<!-- 
this is how you'd expect to handle multiblocks 
/* next code will be part of convert 2D instead
     if(fileHeader.nBlocks>1){
     for (let i = 0; i < fileHeader.nBlocks; i++) {
     fids.push(new Block(fidBuffer, fileHeader));
     }}
     else {}
   */
-->
