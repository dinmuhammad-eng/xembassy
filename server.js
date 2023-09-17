require('dotenv').config
const http = require('http');
const app = require("./index");
const { application } = require('express');
app.listen(8080, ()=>{
    console.log(`Server Started at ${process.env.PORT}`)
})

