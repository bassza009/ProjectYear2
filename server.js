const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const url = require("url")
const sql = require('mysql2')
const { connect } = require('http2')
const { userInfo } = require('os')
const cors =require("cors")
const bodyParser = require('body-parser')
const bcy = require("bcryptjs")
const session = require("express-session")
const { hash } = require('crypto')

//middleware
const middleware=((req,res,next)=>{
    console.log(`Request from ${new Date().toISOString()}`)
    console.log(`Method :${req.method} ,URl : ${req.url}`)
    next()
})
app.use(middleware)
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"components")))

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


//session set
app.use(session({
    secret:"KEysofMysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:24*60*60*1000}
}))

//API for register
app.post("/register",async (req,res)=>{
    
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    const username = req.body.username
    const hash_password = await bcy.hash(password,10)
    const sql = "INSERT INTO userdata (username,email,pass_word) value (?,?,?)"
    database.query(sql,[username,email,hash_password],(err,result)=>{
        if(err){
            console.error(err)
            res.redirect("/register?error=102")//can't register 
            //res.send("Register error"+ err.sqlMessage)
            
        }else{
            res.redirect("/login")
            
        }
    })
})
app.get("/login",(req,res)=>{
    //if already login this will send you to /dashboard
    
    res.sendFile(path.join(__dirname,"components","login.html"))    
})
app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname,"components","register.html"))

})


//API for login
app.post("/login", (req,res)=>{
    const {email,password}= req.body
    const sql = "SELECT * from userdata where email = ?"
    database.query(sql,[email,password],async (err,result)=>{
        if(err){
            throw err
        }
        if (result.length>0){
            const user = result[0]
            const match_pass = await bcy.compare(password,user.pass_word)//compare input password and password in database
            if(match_pass){
                req.session.userid = user.ID //ดึงข้อมูลจากdatabase(ข้างหลังเป็นdatabase)  
                req.session.username = user.username
                req.session.role = 'user' //configเองนะ
                console.log("User login complete"+user.username)
                res.redirect("/dashboard")
            }else{
                res.redirect("/login?error=101")//wrong password
            } 
        }else{
            res.redirect("/login?error=100")//this account doesn't exist
        }
    })
})
app.get("/dashboard",(req,res)=>{
    if(!req.session.userid){
      res.redirect('/?error = 103') //login first  
    }
    res.sendFile(path.join(__dirname,"components","dashboard.html"))
})

app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) {
            throw err
        }res.redirect('/login')
    })
})


app.listen(port,()=>{
    console.log("Server is running....")
})
