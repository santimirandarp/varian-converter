const {join} = require("path");
module.exports = { 
  mode:'development', 
  target: 'web',
  entry:"./main.js",
  output:{
    path:join(__dirname,"/dist"),
    filename:"bundle.js"
}} 

