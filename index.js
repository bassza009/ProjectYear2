const express = require("express")
const Parser = require("parser")
const app = express()
const port = 3000
const bodyParser = require("body-Parser")
const path = require("path")
const cors = require("cors")
const pool = require("./libs/mysql")
const multer = require("multer")
require("dotenv").config()

const middleware = ((req,res,next)=>{
    console.log(`Request from ${new Date().toISOString()}`)
    console.log(`Method : ${req.method} Url : ${req.url}`)
    next()
})
//create middle-ware
app.use(middleware)
app.use(cors())
//app.use(express.static(path.join(__dirname,"components")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//looking ejs file
app.use(express.static(path.join(__dirname,"template")))
app.set("views",path.join(__dirname,"template"))
app.set("view engine","ejs")

//app.use(express.static(path.join(__dirname,"public","photo")))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.static("Template"))
//create path
const homePath = require("./router/home")
const { Template } = require("ejs")
app.use("/",homePath)

//database check
pool.connect((err)=>{
    if(err) throw err;
    console.log('Connected to database')
})


app.listen(port,()=>{
    console.log(`Server  is running... http://localhost:${port}`)
})


