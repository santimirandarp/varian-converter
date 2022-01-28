# Varian NMR, fid format


Varian/Agilent instruments store data in different files under a directory ending in '.fid'. Inside this directory, there is all the data in files:

* **fid**: fid binary data.
* **procpar**: fid params, settings. ASCII.
* **text**: text file.

**fid** file stores experiment's parameters **and** the FIDs **or** NMR spectral data. (this may not
be true, is my interpretation so far).

The FID is the precession of the z-axis spin's magnetic moment over time, which is fourier transformed to get
the spectral data. FIDs are stored as 16 or 32 bit integers. The fourier transformed data is in
32bit floating point numbers.

**procpar** some parameters should be always taken from **fid** file, because they could have changed after measurement was taken. (for example after compresison fid will indicate 16bits and procpar 32bits). The procpar are the parameters set in the software to perform the measurements, but not necessarily the **data** on disk. There are however, important values that are the same, and we can safely scrape out. 

It's necessary to read the binary file to determine data structure and type, probably use some
properties from the procedure-parameters file. In particular about _experimental conditions and the variables controlling the pulse sequence._

The **C** object structures allow to map the bits to `property:value` pairs. Once parsed, the information can be displayed as a JSON object in the JS code.

* Fileheader (first 32B): Holds Important metadata about the file. This is, the number of blocks,
  size of blocks etc. For fid files holding FIDs - and not transformed spectras, the number of block
  headers is 1.
* BlockHeader (28B): Holds Important metadata about the block.

The general structure of those headers is different, but they share some properties (example
[Status class, under utils](./src/utils).)


## Reads
* [Free Induction Decay FID Wiki](https://en.wikipedia.org/wiki/Free_induction_decay).
