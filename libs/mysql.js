const mysql = require("mysql2")

require("dotenv").config()

const pool = mysql.createConnection({
    host:process.env.host,
    user : process.env.user,
    password : process.env.pass,
    database:process.env.dbname
})

module.exports = pool