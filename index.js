const express = require("express")
const Parser = require("parser")
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")
const pool = require("./libs/mysql")
const multer = require("multer")
require("dotenv").config()

const middleware = ((req, res, next) => {
    // console.log(`Request from ${new Date().toISOString()}`)
    // console.log(`Method : ${req.method} Url : ${req.url}`)
    next()
})
//create middle-ware
app.use(middleware)
app.use(cors())
//app.use(express.static(path.join(__dirname,"components")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//looking ejs file
app.use(express.static(path.join(__dirname, "template")))
app.set("views", path.join(__dirname, "template"))
app.set("view engine", "ejs")

//app.use(express.static(path.join(__dirname,"public","photo")))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static("Template"))
//create path
const homePath = require("./router/home")
const postPath = require("./router/post")
const { Template } = require("ejs")
app.use("/", homePath)
app.use("/post", postPath)

//database check
pool.connect((err) => {
    if (err) throw err;
    // console.log('Connected to database')
})

// Review routes
app.get("/review", (req, res) => {
    res.render("review/review");
})

app.post("/review/api", (req, res) => {
    // console.log("Review submitted:", req.body);
    // TODO: Save review to database
    res.redirect("/home?status=review_submitted");
})

app.listen(port, () => {
    console.log(`Server  is running... http://localhost:${port}`)
})


