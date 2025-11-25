const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const url = require("url")
const sql = require('mysql2')
const parser = require("body-parser")
const { connect } = require('http2')
const { userInfo } = require('os')
const cors =require("cors")
//middleware
app.use(cors())
app.use(parser.json())

//Connect to database
const database = sql.createConnection({
    host : "localhost",
    user : "root",
    password : '',
    database : 'sdhire'
})

database.connect((err)=>{
    if(err) throw err;
    console.log('Connected to database')
})

//API for register

app.use(express.static(path.join(__dirname,"components")))


app.listen(port,()=>{
    console.log("Server is running....")
})
