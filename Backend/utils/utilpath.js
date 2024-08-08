// this is the util path page for setting global access path for the root file app.js

const path=require("path");

module.exports=path.dirname(process.mainModule.filename);