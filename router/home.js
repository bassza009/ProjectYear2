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
const { start } = require("repl")


router.use(express.json())
router.use(cookie())
router.use(bodyParser.urlencoded({ extended: true }))

//image destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "/../public/imageForTest"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-0+' + file.originalname)
    }
})
const upload = multer({ storage: storage })

const transport = mailer.createTransport({
    service: "gmail",
    auth: {
        user: "bsspawat@gmail.com",
        pass: "cgkr kjae zada syeu"
    }
})

let otpStore = {}

router.post("/send-otp", (req, res) => {
    console.log("ข้อมูลที่ได้รับจากหน้าเว็บ:", req.body);
    const { email } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000)
    otpStore[email] = otp
    const emailOption = {
        from: `Pawat Support <bsspawat@gmail.com>`,
        to: email,
        subject: "OTP - รหัสยืนยันตัวตน - SDhire",
        html: `<h3>รหัสยืนยันของคุณคือ: <b style="color: #5d2e86; font-size: 24px;">${otp}</b></h3>
               <p>รหัสนี้จะหมดอายุใน 5 นาที</p>`
    }
    transport.sendMail(emailOption, (err, info) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: 'ส่งอีเมลไม่สำเร็จ' })
        }
        res.json({ success: true, message: 'ส่ง OTP สำเร็จ' })
    })
})

router.post("/verifyOTP", (req, res) => {
    const email = req.body.email
    if (otpStore[email] == parseInt(otpStore[email])) {
        delete otpStore[email]
        res.json({ success: true, message: "ยืนยันตัวตนสำเร็จ" })
    } else {
        res.json({ success: false, message: "ยืนยันตัวตนไม่สำเร็จ" })
    }
})

router.get("/", (req, res) => {
    let startpage = req.query.startpage||1
    sql2 = `select * from user_job left join userdata on 
                userdata.ID = user_job.ID `
    sql = `SELECT DISTINCT job_type,COUNT(job_type) AS num_ber FROM user_job
                GROUP BY job_type`
    limitsql =``
    if(startpage<=1){
        startpage=1
    }
    
    if (req.cookies.email) {
        res.redirect("/home")
    } else pool.query(sql, (err, resultsjob) => {
        let jobCount = {}
        let total_job = 0
        if (err) {
            console.log(err) 
            //res.json(resultsjob)
        }
        if (resultsjob) {
            resultsjob.forEach((job) => {
                jobCount[job.job_type] = job.num_ber
                total_job+=job.num_ber
            })
            let totalpage = Math.ceil(total_job/8)
            
            if(startpage<1||((startpage>0)&&(startpage>totalpage))){
                
                startpage=1
            }
            offset = (startpage-1)*8
            limit =`limit ${offset},8`
            sql2+=limit    
        }
            
         pool.query(sql2, (err, results) => {
            if (err) {
                console.log(err)
            }
            
            //res.json({totalpost:total_job})
            res.render("home/homeLogin", {
                userdata: jobCount,
                job: results,
                totalpost:total_job,
                currentPage:startpage
            })
        })
        //res.json(results)
    })
})

router.get("/home", (req, res) => {
    const email = req.cookies.email;
    let startpage = req.query.startpage||1
    if(startpage<=1){
        startpage=1
    }
    if (!email) {
        return res.redirect("/login");
    }

    sql1 = `SELECT * from userdata 
                  LEFT JOIN studentdata ON studentdata.email = userdata.email
                  WHERE userdata.email = ?`;
    sql2 = `SELECT * FROM user_job 
                  LEFT JOIN userdata ON user_job.ID = userdata.ID
                  LEFT JOIN studentdata ON userdata.email = studentdata.email
                  `;
    sql_count = `SELECT DISTINCT job_type, COUNT(job_type) AS num_ber FROM user_job
                       GROUP BY job_type`;
    sql3 = `SELECT * from general_orders`;
    
    let limit=``
    // เริ่ม Query 1
    pool.query(sql1, [email], (err, results) => {
        if (err) { return console.log(err); }
        
        // เริ่ม Query 2
        pool.query(sql3, (err,data) => {
            if (err) { return console.log(err); }

            // เริ่ม Query 3 (Count)
            pool.query(sql_count, (err, counts) => {
                if (err) { return console.log(err); }
                
                let job_count = {};
                let total_job = 0 
                if (counts) {
                    counts.forEach((jobs) => {
                        job_count[jobs.job_type] = jobs.num_ber;
                        total_job += jobs.num_ber
                        
                    });
                }
                totalpage = Math.ceil(total_job/8)
                if(startpage==""||startpage<1||startpage>totalpage){
                    limit = `limit 0,8`
                    startpage=1
                }else{
                    limit = `limit ${startpage*8-8},8` 
                }
        
        sql2+=limit
                // เริ่ม Query 4
                pool.query(sql2, (err, resultsjob) => {
                    if (err) { return console.log(err); }
                    //res.json(total_job)
                    // ส่งข้อมูลไป Render ครั้งเดียวที่ท้ายสุด
                    res.render("home/homepage", {
                        userdata: results[0] || {},
                        job: resultsjob,
                        jobcount: job_count,
                        order: data,
                        totalpost:total_job,
                        currentPage:startpage
                    });
                });
            });
        });
    });
});





router.get("/general/regisGen", (req, res) => {
    res.render("login/createGen")
})
router.post("/regisGen/api", upload.single("file_input"), async (req, res) => {
    let {email,password,phone,
        usernamestd,usernamegen,firstname,lastname,
        group,line,ig,facebook,url} = req.body
    const hash_pass = await bcy.hash(password, 10)
    const stdID = email.split("@")[0]
    firstname = firstname.toUpperCase()
    lastname = lastname.toUpperCase()
    sql = `insert into userdata (email,pass_word,userPhoneNumber,profile_image,username,roles,line,instagram,facebook,url)` 
    sql2 = `insert into userdata (email,pass_word,userPhoneNumber,username,roles,line,instagram,facebook,url)`
    sql3 = `insert into studentdata (studentID,firstname,lastname,Sgroup,email)value(?,?,?,?,?)`
    sqlstd = `value(?,?,?,?,?,"student",?,?,?,?)`
    sqlgen = `value(?,?,?,?,?,"general",?,?,?,?)`
    //const hash_pass = await bcy.hash(password,10)
    const file_input=req.file.filename
    if(email.endsWith("@up.ac.th")){
        sql+=sqlstd
        pool.query(sql,[email,hash_pass,phone,file_input,usernamestd,line,ig,facebook,url],(err,results)=>{
            if(err){
                console.log(err)
                return res.redirect("/general/regisGen?error=103")//can't register
            }pool.query(sql3,[stdID,firstname,lastname,group,email],(err,student)=>{
                if(err){
                    console.log(err)
                    return res.redirect("/general/regisGen?error=103")//can't register
                }res.redirect("/login")
            })
        })
    }else{
        sql+=sqlgen
        pool.query(sql,[email,hash_pass,phone,file_input,usernamegen,line,ig,facebook,url],(err,result)=>{
            if(err){
                console.log(err)
                return res.redirect("/general/regisGen?error=103")//can't register
            }
            res.redirect("/login")
        })
    }  
})

router.get("/student", (req, res) => {
    const email = req.cookies.email
    if (!email.endsWith("@up.ac.th")) {
        return res.redirect("/login?error=109")//login only student
    }
    sql = `SELECT * from userdata where email = ?`
    if (req.cookies.email) {
        pool.query(sql, [email], (err, results, field) => {
            //res.json(results)
            if (results[0].roles == "general") {
                res.redirect("/general")
            } else {
                res.render("home/homepage", { userdata: results[0] })
            }
        })

    } else {
        res.redirect("/login")
    }
})

router.get("/general", (req, res) => {
    const email = req.cookies.email

    sql = `SELECT * from userdata 
              where email = ?`
    if (req.cookies.email) {
        pool.query(sql, [email], (err, results, field) => {
            //res.json(results)
            if (results[0].roles === "student") {
                res.redirect("/student")
            } else {
                res.render("home/homeGen", { userdata: results[0] })
            }
        })

    } else {
        console.log(err)
        res.redirect("login")
    }

})

router.get("/login", (req, res) => {
    const email = req.cookies.email
    if (email) {
        res.redirect('/')
    }
    else { res.render("login/signIn") }
})

router.post("/logingen", (req, res) => {
    const { email, password } = req.body
    if (email.endsWith("@up.ac.th")) {
        return res.redirect("/login?error=108")//login only general
    }
    sql = `SELECT * from userdata where email = ? `
    pool.query(sql, [email], async (err, results) => {
        if (err) {
            console.log(err)
            return res.redirect("/login?error=101")//account doesn't exist
        }
        else {
            if (results.length == 0) {
                console.log(err)
                return res.redirect("/login?error=102")//wrong password or email
            }
            const match_pass = await bcy.compare(password, results[0].pass_word)
            if (match_pass) {
                const token = jwt.sign({ email: email }, process.env.secret)
                const id = results[0].ID
                res.cookie("email", email, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                res.cookie("id", id, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            } else {
                return res.redirect("/login?error=102")

            }
            //res.json(results)
            return res.redirect("/home")

        }
    })
})
router.post("/loginSTD/api", (req, res) => {
    const { email, password } = req.body
    if (!email.endsWith("@up.ac.th")) {
        return res.redirect("/login?error=104")//login only general
    }
    sql = `SELECT * from userdata where email = ? `
    pool.query(sql, [email], async (err, results) => {
        if (err) {
            console.log(err)
            return res.redirect("/login?error=101")//account doesn't exist
        }
        else {
            if (results.length == 0) {
                console.log(err)
                return res.redirect("/login?error=102")//wrong password or email
            }
            const match_pass = await bcy.compare(password, results[0].pass_word)
            if (match_pass) {
                const token = jwt.sign({ email: email }, process.env.secret)
                const id = results[0].ID
                res.cookie("email", email, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                res.cookie("id", id, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            } else {
                return res.redirect("/login?error=102")

            }
            //res.json(results)
            return res.redirect("/home")

        }
    })
})
router.get("/home/profilestudent/:id", (req, res) => {
    const id = req.params.id
    const { email } = req.cookies
    sql = `SELECT * from userdata 
                left join studentdata 
                on studentdata.email = userdata.email 
                where userdata.email = ?`
    sql2 = `SELECT * from userdata 
                left join studentdata 
                on studentdata.email = userdata.email 
                left join user_job
                on user_job.ID = userdata.ID 
                where userdata.id = ?`

    if (!email) {
        return res.redirect("/login?error=110")//login first
    }
    pool.query(sql, [email], (err, results, fields) => {
        if (err) {
            console.log(err)

        } pool.query(sql2, [id], (err, datas) => {
            if (err) {
                console.log(err)
            }
            res.render("profile/profile", {
                userdata: results[0],
                post: datas[0]
            })
        })
        //res.json(results)

    })
})

router.get("/home/profilegeneral", (req, res) => {
    const { email } = req.cookies

    const sql1 = `SELECT * from userdata where email = ?`
    const sql2 = `SELECT * FROM general_orders WHERE general_id = ? ORDER BY post_date DESC`

    if (!email) {
        return res.redirect("/login?error=110")//login first
    }

    pool.query(sql1, [email], (err, results, fields) => {
        if (err) {
            console.error(err)
            return res.redirect("/login")
        }

        const userId = results[0].ID

        // Fetch job postings for this user
        pool.query(sql2, [userId], (err, jobs) => {
            if (err) {
                console.error("Error fetching jobs:", err)
                jobs = []
            }

            res.render("profile/profilegen", {
                userdata: results[0],
                jobs: jobs || [],
                jobCount: jobs ? jobs.length : 0
            })
        })
    })
})
router.get("/student/post_skill", upload.single("file_input"), (req, res) => {

    const { email } = req.cookies
    const sql = `select * from userdata 
                left join studentdata
                on studentdata.email = userdata.email 
                left join user_job
                on userdata.ID = user_job.ID
                where userdata.email = ?`
    if (!req.cookies.email) {
        return res.redirect("/")
    }
    pool.query(sql, [email], (err, results) => {
        if (results[0].roles != "student") {
            console.log(err)
            return res.redirect("/")
        } else if (err) {
            console.log(err)
            return res.redirect("/")
        }
        //res.json(results)
        res.render("post/post_skill", { userdata: results[0] })
    })

})


router.post("/post/api", upload.single("file_input"), (req, res) => {
    const { email, id } = req.cookies
    const { title, job_type, budjet, description, file_input } = req.body
    const sqledit = `INSERT INTO user_job(ID,title,des_cription,job_type,budjet,job_create,service_image) 
                    VALUES(?,?,?,?,?,1,?)`
    const picture_file = req.file.filename
    if (!email) {
        return res.redirect("/?error=101")
    }
    pool.query(sqledit, [id, title, description, job_type, budjet, picture_file], (err, results) => {
        if (err) {
            console.log(err)
        }
        res.redirect("/home?post_success=101")
    })
})
router.post("/editPost/api", upload.single("file_input"), (req, res) => {
    const { email, id } = req.cookies
    const { title, job_type, budjet, description, file_input } = req.body
    const sqledit = `UPDATE user_job 
                    set title = ?,des_cription = ?,budjet = ?,job_type =?,service_image =?
                    where ID = ?`
    const sqleditnopic = `UPDATE user_job 
                    set title = ?,des_cription = ?,budjet = ?,job_type =?
                    where ID = ?`

    if (!email) {
        return res.redirect("/?error=101")
    } if (req.file) {
        const picture_file = req.file.filename
        pool.query(sqledit, [title, description, budjet, job_type, picture_file, id], (err, results) => {
            if (err) {
                console.log(err)
            }

            res.redirect("/home?edit_success=101")
        })
    } else {

        pool.query(sqleditnopic, [title, description, budjet, job_type, id], (err, results) => {
            if (err) {
                console.log(err)
            }

            res.redirect("/home?edit_success=101")
        })

    }

})
router.post("/deletePost/api", (req, res) => {

})

router.get("/home/viewStdPost/:id", (req, res) => {
    const id = req.params.id
    const { email } = req.cookies
    const sql = `Select * from user_job
                left join userdata
                on userdata.ID=user_job.ID
                left join studentdata
                on studentdata.email = userdata.email
                where user_job.job_id = ?`
    const sql2 = `select * from userdata
                left join studentdata
                on studentdata.email=userdata.email
                where userdata.email = ?`
    pool.query(sql2, [email], (err, results) => {
        if (err) {
            console.log(err)
            return res.redirect('/error=114')
        } pool.query(sql, [id], (err, data) => {
            if (err) {
                console.log(err)
                return res.redirect('/error=114')
            }
            //res.json(data[0])
            res.render("post/viewpoststd", {
                userdata: results[0],
                post: data[0]
            })
        })
        //res.json(results) 
    })
})
router.post("/student/deletePost", (req, res) => {
    const sql = `delete from user_job where ID = ?`
    const { email, id } = req.cookies
    pool.query(sql, [id], (err, results) => {
        if (err) {
            console.log(err)
            return res.redirect('/home/profilestudent?error=115')//delete fail
        }
        res.redirect("/home/profilestudent?success=102")
    })
})
router.post("/student/update", (req, res) => {
    const { email } = req.cookies
    const { phone, line, ig } = req.body
    sql = `update userdata 
            right join studentdata
            on studentdata.email = userdata.email
            set userPhoneNumber = ?,line = ?,instagram = ?
            where studentdata.email = ?`
    pool.query(sql, [phone, line, ig, email], (err, results) => {
        if (err) {
            console.log(err)
            return res.json({ success: "false", messege: "Edit false" })//edit failed
        } res.json({ success: "true" })
    })
})

router.post("/student/changeAvatar", upload.single("file_input"), (req, res) => {
    const { email } = req.cookies
    const filename = req.file.filename
    sql = `update userdata
            set profile_image = ?
            where email = ?`
    pool.query(sql, [filename, email], (err, results) => {
        if (err) {
            console.log(err)
            return res.json({ success: "false", message: "failed to upload avatar" })
        }
        res.json({ success: "true", message: "Change avatar complete" })
    })
})

router.post("/general/changeAvatar", upload.single("file_input"), (req, res) => {
    const { email } = req.cookies
    const filename = req.file.filename
    const sql = `update userdata
            set profile_image = ?
            where email = ?`
    pool.query(sql, [filename, email], (err, results) => {
        if (err) {
            console.log(err)
            return res.json({ success: false, message: "failed to upload avatar" })
        }
        res.json({ success: true, message: "Change avatar complete" })
    })
})

router.get("/home/filter/:job_type", (req, res) => {
    const { email } = req.cookies
    const jobType = req.params.job_type
    
    // ใช้ชื่อเดิม: startpage
    let startpage = parseInt(req.query.startpage) || 1
    if (startpage < 1) startpage = 1

    // ใช้ชื่อเดิม: sql2 (ดึงข้อมูล User)
    let sql2 = `SELECT * FROM user_job
                RIGHT JOIN userdata ON userdata.ID = user_job.ID
                LEFT JOIN studentdata ON studentdata.email = userdata.email
                WHERE userdata.email = ?`

    // ตัวแปรใหม่: sqlCount (ต้องเพิ่มเพื่อใช้นับจำนวนงานทั้งหมด)
    let sqlCount = `SELECT COUNT(*) AS total FROM user_job WHERE job_type = ?`

    // ใช้ชื่อเดิม: sql (ดึงข้อมูลงาน Job)
    let sql = `SELECT * FROM user_job
               LEFT JOIN userdata ON userdata.ID = user_job.ID
               LEFT JOIN studentdata ON studentdata.email = userdata.email
               WHERE job_type = ?`

    if (!email) {
        return res.redirect("/home?error=106")
    }

    // เริ่ม Query 1: sql2 (User) -> เก็บผลใน results
    pool.query(sql2, [email], (err, results) => {
        if (err) {
            console.log(err)
            return res.redirect("/home?error=105")
        }

        // เริ่ม Query 2: sqlCount (นับจำนวน) -> เก็บผลใน countResult
        pool.query(sqlCount, [jobType], (err, countResult) => {
            if (err) {
                console.log(err)
                return res.redirect("/home?error=106")
            }

            // คำนวณ Pagination
            const totalpost = countResult[0].total
            const totalpage = Math.ceil(totalpost / 8)

            if (startpage > totalpage && totalpage > 0) {
                startpage = 1
            }

            const offset = (startpage - 1) * 8
            
            // เติม Limit ใส่ sql ตัวเดิม
            sql += ` LIMIT ${offset}, 8`

            // เริ่ม Query 3: sql (Job) -> เก็บผลใน data
            pool.query(sql, [jobType], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.redirect("/home?error=106")
                }

                res.render("jobtype/job_type", {
                    userdata: results[0], // ใช้ results ตัวเดิม
                    post: data,           // ใช้ data ตัวเดิม
                    jobtype: jobType,
                    totalpost: totalpost, // ส่งค่าจำนวนงานทั้งหมดไป
                    currentPage: startpage, // ส่งหน้าปัจจุบันไป
                    paginationUrl: `/home/filter/${jobType}`, 
                    budget: null
                })
            })
        })
    })
})
router.get("/home/filter/:job_type/budget", (req, res) => {
    const { email } = req.cookies
    const jobType = req.params.job_type
    const budget = req.query.budget
    
    // 1. แปลง startpage เป็นตัวเลข
    let startpage = parseInt(req.query.startpage) || 1
    if (startpage < 1) startpage = 1

    if (budget == "") {
        return res.redirect(`/home/filter/${jobType}`)
    }

    // 2. Query เดิม: ดึงข้อมูล User (ใช้ sql2)
    let sql2 = `Select * from user_job
                right join userdata
                on userdata.ID = user_job.ID
                left join studentdata
                on studentdata.email = userdata.email
                where userdata.email = ?`

    // 3. Query ใหม่: นับจำนวนงานทั้งหมดตามเงื่อนไข (Job Type และ Budget)
    let sqlCount = `SELECT COUNT(*) AS total FROM user_job 
                    WHERE job_type = ? AND budjet < ?`

    // 4. Query เดิม: ดึงข้อมูลงาน (ใช้ sql)
    let sql = `Select * from user_job
               left join userdata
               on userdata.ID = user_job.ID
               left join studentdata
               on studentdata.email = userdata.email
               where user_job.job_type = ? and user_job.budjet < ?
               `

    if (!email) {
        return res.redirect("/home?error=106")//login first
    }

    // เริ่ม Query 1: sql2 (User Data) -> เก็บผลใน results
    pool.query(sql2, [email], (err, results) => {
        if (err) {
            console.log(err)
            return res.redirect("/home?error=105")//wrong email
        }

        // เริ่ม Query 2: sqlCount (นับจำนวน) -> เก็บผลใน countResult
        pool.query(sqlCount, [jobType, budget], (err, countResult) => {
            if (err) {
                console.log(err)
                return res.redirect("/home?error=106")
            }

            // คำนวณ Pagination
            const totalpost = countResult[0].total
            const totalpage = Math.ceil(totalpost / 8)

            // เช็คว่าหน้าเกินจำนวนที่มีไหม
            if (startpage > totalpage && totalpage > 0) {
                startpage = 1
            }

            const offset = (startpage - 1) * 8
            
            // เติม Limit ใส่ sql ตัวเดิม
            sql += ` LIMIT ${offset}, 8`

            // เริ่ม Query 3: sql (Job Data) -> เก็บผลใน data
            pool.query(sql, [jobType, budget], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.redirect("/home?error=106")//input error
                }

                res.render("jobtype/job_type", {
                    paginationUrl: `/home/filter/${jobType}`, // ✅ เพิ่มบรรทัดนี้
                    budget: null, // ส่ง null ไปกัน EJS error
                    userdata: results[0],   // ใช้ results ตัวเดิม
                    post: data,             // ใช้ data ตัวเดิม
                    jobtype: jobType,
                    budget: budget,
                    totalpost: totalpost,   // ส่งค่าจำนวนงานทั้งหมดไป
                    currentPage: startpage, // ส่งหน้าปัจจุบันไป
                    currentUrl: req.originalUrl,
                    paginationUrl: `/home/filter/${jobType}/budget`
                })
            })
        })
    })
})
router.get("/home/filter/:job_type/:sort", (req, res) => {
    const { email } = req.cookies
    const jobType = req.params.job_type
    const sort = req.params.sort
    const budget = req.query.budget
    
    let startpage = parseInt(req.query.startpage) || 1
    if (startpage < 1) startpage = 1

    let sql2 = `Select * from user_job
                right join userdata
                on userdata.ID = user_job.ID
                left join studentdata
                on studentdata.email = userdata.email
                where userdata.email = ?`

    let whereClause = ` where job_type = ? `
    let jobParams = [jobType]

    if (budget) {
        whereClause += ` and user_job.budjet < ?`
        jobParams.push(budget)
    }

    let sqlCount = `Select COUNT(*) AS total from user_job ` + whereClause

    let sql = `Select * from user_job
               left join userdata
               on userdata.ID = user_job.ID
               left join studentdata
               on studentdata.email = userdata.email` + whereClause

    if (sort == "highlow") {
        sql += ` order by user_job.budjet asc`
    } else if (sort == "lowhigh") {
        sql += ` order by user_job.budjet desc`
    }

    if (!email) {
        return res.redirect("/home?error=106")
    }

    pool.query(sql2, [email], (err, results) => {
        if (err) {
            console.log(err)
            return res.redirect("/home?error=105")
        }

        pool.query(sqlCount, jobParams, (err, countResult) => {
            if (err) {
                console.log(err)
                return res.redirect("/home?error=106")
            }

            const totalpost = countResult[0].total
            const totalpage = Math.ceil(totalpost / 8)

            if (startpage > totalpage && totalpage > 0) {
                startpage = 1
            }

            const offset = (startpage - 1) * 8
            sql += ` LIMIT ${offset}, 8`

            pool.query(sql, jobParams, (err, data) => {
                if (err) {
                    console.log(err)
                    return res.redirect("/home?error=106")
                }

                res.render("jobtype/job_type", {
                    userdata: results[0],
                    post: data,
                    jobtype: jobType,
                    budget: budget,
                    totalpost: totalpost,
                    currentPage: startpage,
                    currentUrl: req.originalUrl,
                    paginationUrl: `/home/filter/${jobType}/${sort}`
                })
            })
        })
    })
})









//==============================================================/
// Existing login API...
router.post("/login/api", (req, res) => {
    // ... (existing code omitted)
})

// New Route: View Student Profile
router.get("/home/viewStudentProfile/:id", (req, res) => {
    const studentId = req.params.id;
    const email = req.cookies.email;

    if (!email) {
        return res.redirect("/login");
    }

    // 1. Get current logged-in user (General)
    const sqlCurrentUser = `SELECT * FROM userdata WHERE email = ?`;

    // 2. Get target student data
    const sqlTargetStudent = `SELECT * FROM userdata 
                                  LEFT JOIN studentdata ON userdata.email = studentdata.email 
                                  WHERE userdata.ID = ?`;

    // 3. Get student's jobs (optional, for display)
    const sqlStudentJobs = `SELECT * FROM user_job WHERE ID = ?`;

    pool.query(sqlCurrentUser, [email], (err, userResults) => {
        if (err) { console.log(err); return res.redirect("/home"); }

        if (userResults.length === 0) return res.redirect("/login");

        pool.query(sqlTargetStudent, [studentId], (err, studentResults) => {
            if (err) { console.log(err); return res.redirect("/home"); }

            if (studentResults.length === 0) {
                return res.redirect("/home?error=student_not_found");
            }

            pool.query(sqlStudentJobs, [studentId], (err, jobResults) => {
                // Render the original EJS template
                res.render("profile/viewProfileUser", {
                    userdata: userResults[0], // Current user (General)
                    student_user: studentResults[0], // Target student
                    student_jobs: jobResults || [],
                    student_job_count: jobResults ? jobResults.length : 0
                });
            });
        });
    });
});


router.get("/showdata", (req, res) => {
    pool.query(`SELECT * from userdata `, (err, rows, fields) => {
        if (err) {
            throw err

        }
        //res.json(rows)
        res.render("showdata", { userdata: rows })
    })

})

router.get("/showindivi", (req, res) => {
    pool.query(`SELECT * from userdata`, (err, rows, field) => {
        if (err) throw err
        res.render("showindivi", { userdata: rows })
    })

})
router.post("/indivi/api", (req, res) => {
    const id = req.body.id
    pool.query(`SELECT * from userdata where ID = ?`, [id], (err, rows, fields) => {
        if (err) {
            throw err
        }
        //res.json(rows)
        res.render("showindivi", { userdata: rows[0] })
    })
})
router.get("/register", (req, res) => {
    res.render("register")
})
router.post("/register/api", upload.single("picture"), async (req, res) => {
    const { username, email, phone, password } = req.body

    if (!req.file) {
        return res.redirect("/register?error=uploadfile")
    }
    const picture = req.file.filename
    sql = `INSERT INTO userdata (username,email,userPhoneNumber,pass_word,profile_image)
                    VALUES (?,?,?,?,?)`
    bcy.hash(password, 12, (err, hash) => {
        if (err) {
            console.log(err)
            res.redirect('/register?error=101')
        } else {
            pool.query(sql, [username, email, phone, hash, picture], (err, result) => {
                if (err) {
                    console.log(err)

                }
                res.redirect("/showindivi?success_register")
            })
        }
    })
})
router.post("/logout", (req, res) => {
    const email = req.cookies.email
    if (email) {
        res.clearCookie("token")
        res.clearCookie("email")
        res.clearCookie("id")
        res.redirect("/")
    }

})
module.exports = router