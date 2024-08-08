// this is the root file which will executed to start the node server

const express=require('express');

const app=express();


app.use((req,res,next)=>{
    console.log("server just started");
    res.send("<h1>Welcome to Express server");
})

app.listen(3000);