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
const bodyParser = require('body-parser')


//middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))


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
app.use(express.static(path.join(__dirname,"components")))
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'components','login.html'))
})
//API for register
app.post("/register",(req,res)=>{
    console.log(req.body)
    
    const email = req.body.email
    const password = req.body.password
    const username = req.body.username
    
    const sql = "INSERT INTO userdata (username,email,pass_word) value (?,?,?)"
    database.query(sql,[username,email,password],(err,result)=>{
        if(err){
            console.error(err)
            
            res.send("Register error")
        }else{
            res.redirect("/login")
            
        }
    })
})

//API for login
app.post("/login",(req,res)=>{
    const {email,password}= req.body
    const sql = "SELECT pass_word from userdata where email = ?"
    database.query(sql,[email,password],(err,result)=>{
        if(err){
            throw err
        }
        if (result.length>0){
            res.sendFile(path.join(__dirname,"Components","index.html"))
        }else{
            res.send("Password or email incorrect")
        }
    })
})





app.listen(port,()=>{
    console.log("Server is running....")
})
