const express = require("express")
const {join} = require("path");
const app = express();

app.use('/', express.static(join(__dirname,"/dist")))

app.get('/', (req,res)=>{
res.sendFile(join(__dirname,"index.html"))
})

app.listen(3000, ()=>console.log('listening on 3000'))
