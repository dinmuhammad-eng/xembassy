const express = require('express');
const cors = require("cors");
const connection = require('./connection');
const userRoute = require('./routes/user')
const categoryRoute = require("./routes/categery");
const categoryRoute2 = require("./routes/categery2");

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user',userRoute);
app.use('/category', categoryRoute);
app.use('/category2', categoryRoute2);


module.exports = app;
