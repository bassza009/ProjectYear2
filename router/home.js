    const express = require("express")
    const router = express.Router()
    const bodyParser = require("body-parser")
    const path = require("path")
    const pool = require("../libs/mysql")
    const bcy = require("bcrypt")
    const jwt = require("jsonwebtoken")
    const cookie = require("cookie-parser")
    const multer = require("multer")
    const mailer = require("nodemailer")
    

    router.use(express.json())
    router.use(cookie())
    router.use(bodyParser.urlencoded({extended:true}))

    //image destination
    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,path.join(__dirname,"../public/imageForTest"))
        },
        filename:function(req,file,cb){
            cb(null,Date.now()+'-0+'+ file.originalname)
        }
    })
    const upload = multer({storage:storage})

    const transport = mailer.createTransport({
        service:"gmail",
        auth:{
            user:"bsspawat@gmail.com",
            pass: "cgkr kjae zada syeu"
        }
    })

    let otpStore = {}

    router.post("/send-otp",(req,res)=>{
        console.log("ข้อมูลที่ได้รับจากหน้าเว็บ:", req.body);
        const{email} = req.body
        const otp = Math.floor(100000+Math.random()*900000)
        otpStore[email] = otp
        const emailOption ={
            from : `Sdhire system <bsspawat@gmail.com>`,
            to: email,
            subject:"OTP - รหัสยืนยันตัวตน - SDhire",
            html: `<h3>รหัสยืนยันของคุณคือ: <b style="color: #5d2e86; font-size: 24px;">${otp}</b></h3>
               <p>รหัสนี้จะหมดอายุใน 5 นาที</p>`
        }
        transport.sendMail(emailOption,(err,info)=>{
            if(err){
                console.log(err)
                return res.json({ success: false, message: 'ส่งอีเมลไม่สำเร็จ' })
            }
            res.json({ success: true, message: 'ส่ง OTP สำเร็จ' })
        })
    })

    router.post("/verifyOTP",(req,res)=>{
        const email = req.body.email
        if(otpStore[email] == parseInt(otpStore[email])){
            delete otpStore[email]
            res.json({success : true ,message:"ยืนยันตัวตนสำเร็จ"})
        }else{
            res.json({success : false ,message:"ยืนยันตัวตนไม่สำเร็จ"})
        }
    })

    router.get("/",(req,res)=>{
        if(req.cookies.email){
            res.redirect("/general")
        }else{
            res.render("home/homeLogin")
        }
        
    })

    router.get("/student",(req,res)=>{
        const email = req.cookies.email
        sql = `SELECT * from userdata where email = ?`
        if(req.cookies.email){
            pool.query(sql,[email],(err,results,field)=>{
                //res.json(results)
                if(results[0].roles == "general"){
                    res.redirect("/general")
                }else{
                res.render("home/homeStu",{userdata:results[0]})}
            })
            
        }else{
        res.redirect("/login")}
    })

    router.get("/general",(req,res)=>{
        const email = req.cookies.email
        sql = `SELECT * from userdata where email = ?`
        if(req.cookies.email){
            pool.query(sql,[email],(err,results,field)=>{
                //res.json(results)
                if(results[0].roles == "student"){
                    res.redirect("/student")
                }else{
                res.render("home/homeGen",{userdata:results[0]})}
            })
                
        }else{
            res.redirect("login")
        }
        
    })

    router.get("/general/regisGen",(req,res)=>{
        res.render("login/createGen")
    })
    router.post("/regisGen/api",async(req,res)=>{
        const {email,password,phone,file_input,username} = req.body
        if(email.endsWith("@up.ac.th")){
            return res.redirect("/student/regisStu")
        }
        sql =`insert into userdata (email,pass_word,userPhoneNumber,profile_image,username,roles)
                values(?,?,?,?,?,"general")`
        const hash_pass = await bcy.hash(password,10)
        pool.query(sql,[email,hash_pass,phone,file_input,username],(err,results,fields)=>{
            if(err){
                if(err.errno==1062){
                    
                    return res.redirect("/general/regisGen?error=104")//This email already exist
                    
                }
                console.log(err)
                return res.redirect("/general/regisGen?error=103")//can't register
                
            }
            res.redirect("/login")
        })
    })
    router.get("/student/regisStu",(req,res)=>{
        res.render("login/createStu")
    })
    router.post("/registerStd/api",(req,res)=>{


    })

    router.get("/login",(req,res)=>{
        res.render("login/signIn")
    })

    router.post("/logingen",(req,res)=>{
        const{email,password} = req.body
        
        sql = `SELECT * from userdata where email = ? `
        pool.query(sql,[email],async(err,results)=>{
            if(err){
                console.log(err)
                return res.redirect("/login?error=101")//account doesn't exist
            }
            else{
                if(results.length == 0){
                    console.log(err)
                    return res.redirect("/login?error=102")//wrong password or email
                }
                const match_pass = await bcy.compare(password,results[0].pass_word)
                if(match_pass){    
                    const token = jwt.sign({email:email},process.env.secret)
                    res.cookie("email",email,{maxAge: 24*60*60*1000,httpOnly:true})
                    res.cookie("token",token,{maxAge: 24*60*60*1000,httpOnly:true})
                }
                //res.json(results)
                return res.redirect("/general")
                
            }
        })
    })

    router.post("/loginSTD/api",(req,res)=>{
        const {email,password} = req.body
        sql = `SELECT * from userdata where email = ?`
        if(!email.endsWith("@up.ac.th")){
            res.redirect("/login?error=104")//wrong email type
        }else{
            pool.query(sql,[email],async(err,results,fields)=>{
                if(err){
                    console.log(err)
                    return res.redirect("/login?error=101")
                }else{
                    if(results.length == 0){
                    console.log(err)
                    return res.redirect("/login?error=102")//wrong password or email
                }
                const match_pass = await bcy.compare(password,results[0].pass_word)
                if(match_pass){    
                    const token = jwt.sign({email:email},process.env.secret)
                    res.cookie("email",email,{maxAge: 24*60*60*1000,httpOnly:true})
                    res.cookie("token",token,{maxAge: 24*60*60*1000,httpOnly:true})
                }
                //res.json(results)
                return res.redirect("/student")
                
            }

            })
        }
        

    })

    router.get("/showdata",(req,res)=>{
        pool.query(`SELECT * from userdata `,(err,rows,fields)=>{
            if(err){
                throw err
                
            } 
            //res.json(rows)
            res.render("showdata",{userdata:rows})
        })
        
    })

    router.get("/showindivi",(req,res)=>{
        pool.query(`SELECT * from userdata`,(err,rows,field)=>{
            if(err) throw err
            res.render("showindivi",{userdata:rows})
        })
        
    })
    router.post("/indivi/api",(req,res)=>{
        const id = req.body.id
        pool.query(`SELECT * from userdata where ID = ?`,[id],(err,rows,fields)=>{
            if(err){
                throw err
            }
            //res.json(rows)
            res.render("showindivi",{userdata:rows[0]})
        })
    })
    router.get("/register",(req,res)=>{
        res.render("register")
    })
    router.post("/register/api",upload.single("picture"),async(req,res)=>{
        const {username,email,phone,password} = req.body
        
        if(!req.file){
            return res.redirect("/register?error=uploadfile")
        }
        const picture = req.file.filename
        sql = `INSERT INTO userdata (username,email,userPhoneNumber,pass_word,profile_image)
                    VALUES (?,?,?,?,?)`
        bcy.hash(password,12,(err,hash)=>{
            if(err){
                console.log(err)
                res.redirect('/register?error=101')
            }else{
                pool.query(sql,[username,email,phone,hash,picture],(err,result)=>{
                if(err){
                    console.log(err)
                    
                }
                res.redirect("/showindivi?success_register")
            })}
        })
    })
    router.post("/logout",(req,res)=>{
        const email = req.cookies.email
        if(email){
            res.clearCookie("token")
            res.clearCookie("email")
            res.redirect("/")
        }
        
    })
    module.exports = router