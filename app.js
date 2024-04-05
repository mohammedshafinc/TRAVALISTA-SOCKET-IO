require("dotenv").config();

const cors = require("cors");

const mongoose = require("mongoose");
const port = process.env.PORT 
const DB_url = process.env.MONGO_URI


const express = express('express')
const app = express()
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer, {cors:{origin:'*'}
})

const users = [];
app.use(cors())

mongoose.connect(DB_url).then(()=>{
    console.log('connected to mongodb');
}).catch((err)=>{console.error('failed to connect mongo db' ,err);})


