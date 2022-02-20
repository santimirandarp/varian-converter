# Varian Native format

Varian/Agilent instruments store data under a directory ending in '.fid': 
* **fid**: fid binary data.
* **procpar**: text file. Sample information, instrument parameters (pulse width etc.)
* **text**: text file. Comments, notes text.
* **log**: text file. Error messages, acquisition data.

**fid** file stores runtime flags **and** the 1D fid | 2D fid | spectral data.

The spin's magnetic moment is excited and the decay I(t) record is the fid; those are in turn FT transformed to get
the frequency -spectral- data.

> The actual FID data is typically stored as pairs floating-point numbers. The first represents the real part of a complex pair and the second represents the imaginary component.  
From the VnmrJ User Programming Manual (chapter 5).

**procpar** some parameters should be read from **fid** file, because they could have changed after measurement was taken. (for example after compression fid will indicate 16bits and procpar 32bits). The procpar stores parameters set in the software to perform the measurements, but not necessarily the **data** on disk. Some values though, we can safely scrape out. 

The C header **data.h** is the map to interpret the binary code.

* Fileheader (first 32B): File Metadata: number of blocks, size of blocks etc. 
* BlockHeader (28B): Block Metadata.
* BlockBody: Int16 | Int32 | Float32

## Blocks
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
								
_All blocks within one file have exactly the same size_.
								


## procpar
Text file storing the user input information, instrument settings. The arrange of
data is similar to:
```
<name> <subType> <basicType> ...
<nOfLines> <values>
lines 'children' of prev line
optional line
<name> <subType> <basicType> ...
<nOfLines> <values>
lines 'children' of prev line
```

The first `<name>` line is pretty much like a header, and tells how to parse the rest (apart from some data
included in the other lines themselves).

### Parameters
Some useful parameter names. To get the parameters from the array you could filter it by name (if you know the name): `arr.filter(p=> p.name=='apptype')`. It will be stored in the key "name".
These are a few `name`s, alphabetically:

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
See [OpenVnmrJ variables.h](https://github.com/OpenVnmrJ/OpenVnmrJ/blob/master/src/vnmr/variables.h)
for info on how to parse this file.

## NMR brief background
The Free Induction Decay experiment (FID) consist in irradiating a sample in a static magnetic field (B) with a pulse of radiofrequency (Rf, EM wave at that range of frequencies) that excites the nuclear spin. The resonance radio frequency (RRf) is chosen for a particular atom and applied **B** (zeeman effect). Those then decay back to equilibrium and this signal (induced voltage caused by the change in magnetic field) is measured over time. This decay-energy is called Free Induction Decay (FID). The environment effect makes possible to distinguish different magnetic atoms (shielding effect): Beff = B - Bshielding.

Applied B induces a B opposed to it in the sample, known as bulk magnetization. The actual RRf changes the spin and moves the bulk magnetization vector from Z (applied B) to xy plane (sample then relaxes by Spin-Lattice, T1, or Spin-Spin, T2). If there is no magnetic field, there is no energy difference. If there is, the energy difference is proportional to the applied field (This is known as Zeeman Effect. [Basics here][Zeeman]). 

## Reads
* [Free Induction Decay FID Wiki](https://en.wikipedia.org/wiki/Free_induction_decay).
* [NMR and Imaging](https://www.cis.rit.edu/htbooks/mri/)
* [Fourier Transform](https://homepages.inf.ed.ac.uk/rbf/CVonline/LOCAL_COPIES/OWENS/LECT4/node2.html)
* [Zeeman](https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Magnetic_Resonance_Spectroscopies/Nuclear_Magnetic_Resonance/Nuclear_Magnetic_Resonance_II)
