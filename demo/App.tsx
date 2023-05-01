import React from "react"

export function App() {
  return (
    <><h1>1D Spectra</h1>
    <Form/>
    </>
  )
}
function Form(){
    return (
      <form id="form">
        <p>
          <label htmlFor="zippedFile">Browse for a zipped file</label>
          <input type="file" id="zippedFile" name="zippedFile" accept=".zip" />
        </p>
        <p>
          <label htmlFor="dir">Browse for a directory</label>
          <input type="file" id="dir" name="dir" 
          /* @ts-expect-error */
          webkitdirectory="" directory=""/>
        </p>
        <p id="info"></p>
      </form>
    )
}
export default App
