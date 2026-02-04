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
    sql2 = `select * from user_job left join userdata on 
                userdata.ID = user_job.ID`
    sql = `SELECT DISTINCT job_type,COUNT(job_type) AS num_ber FROM user_job
                GROUP BY job_type `
    if (req.cookies.email) {
        res.redirect("/home")
    } else pool.query(sql2, (err, results) => {
        if (err) {
            console.log(err)
        } pool.query(sql, (err, resultsjob) => {
            if (err) {
                console.log(err)
            }
            let jobCount = {}
            //res.json(resultsjob)
            if (resultsjob) {
                resultsjob.forEach((job) => {
                    jobCount[job.job_type] = job.num_ber
                })
            }
            //res.json(jobCount)
            res.render("home/homeLogin", {
                userdata: jobCount,
                job: results
            })
        })
        //res.json(results)

    })




})

router.get("/home", (req, res) => {
    const email = req.cookies.email;

    if (!email) {
        return res.redirect("/login");
    }

    const sql1 = `SELECT * from userdata 
                  LEFT JOIN studentdata ON studentdata.email = userdata.email
                  WHERE userdata.email = ?`;
    const sql2 = `SELECT * FROM user_job 
                  LEFT JOIN userdata ON user_job.ID = userdata.ID
                  LEFT JOIN studentdata ON userdata.email = studentdata.email
                  limit 0 ,8`;
    const sql_count = `SELECT DISTINCT job_type, COUNT(job_type) AS num_ber FROM user_job
                       GROUP BY job_type`;
    const sql3 = `SELECT * from general_orders`;

    // เริ่ม Query 1
    pool.query(sql1, [email], (err, results) => {
        if (err) { return console.log(err); }

        // เริ่ม Query 2
        pool.query(sql2, (err, resultsjob) => {
            if (err) { return console.log(err); }

            // เริ่ม Query 3 (Count)
            pool.query(sql_count, (err, counts) => {
                if (err) { return console.log(err); }

                let job_count = {};
                if (counts) {
                    counts.forEach((jobs) => {
                        job_count[jobs.job_type] = jobs.num_ber;
                    });
                }

                // เริ่ม Query 4
                pool.query(sql3, (err, data) => {
                    if (err) { return console.log(err); }

                    // ส่งข้อมูลไป Render ครั้งเดียวที่ท้ายสุด
                    res.render("home/homepage", {
                        userdata: results[0] || {},
                        job: resultsjob,
                        jobcount: job_count,
                        order: data
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
    const {email,password,phone,
        usernamestd,usernamegen,firstname,lastname,
        group,line,ig,facebook,url} = req.body
    const hash_pass = await bcy.hash(password, 10)
    const stdID = email.split("@")[0]
    
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


router.get("/student/regisStu", (req, res) => {
    res.render("login/createStu")
})
router.post("/registerStd/api", (req, res) => {
    const email = req.cookies.emailRegis
    const password = req.cookies.passwordRegis
    const username = req.cookies.usernameRegis
    const file_input = req.cookies.file_inputRegis
    const phone = req.cookies.phoneRegis
    const stdID = email.split("@")[0]
    const { description, facebook, instagram, line, url, firstname, lastname, group } = req.body
    const upperFirstName = (firstname || "").toUpperCase()
    const upperLastName = (lastname || "").toUpperCase()
    sqlUserData = `insert into userdata(email,pass_word,username,userPhoneNumber,profile_image,roles)
                        values(?,?,?,?,?,"student")`
    sqlStudent = `insert into studentdata(studentID,facebook,instagram,line,URL,des_cription,email,firstname,lastname,Sgroup)
                        values(?,?,?,?,?,?,?,?,?,?)`
    if (!email) {
        res.clearCookie("token")
        res.clearCookie("emailRegis")
        res.clearCookie("usernameRegis")
        res.clearCookie("passwordRegis")
        res.clearCookie("phoneRegis")
        res.clearCookie("file_inputRegis")
        return res.redirect("/login")
    } else {
        pool.query(sqlUserData, [email, password, username, phone, file_input], (err, results, field) => {
            if (err) {
                if (err.errno == 1062) {
                    console.log(err)
                    return res.redirect("/general/regisGen?error=104")//This email already exist 
                }
                console.log(err)
                console.log(err)
                return res.redirect("/general/regisGen?error=103")//can't register

            } pool.query(sqlStudent, [stdID, facebook, instagram, line, url, description, email, upperFirstName, upperLastName, group], (err, results, fields) => {
                if (err) {
                    console.log(err)
                    return res.redirect("/student/regisStu?error=106")//can't access studentdata
                }
                res.redirect("/login")
            })
        })
    }
})

router.post("/clear-regis-cookies", (req, res) => {
    res.clearCookie("emailRegis");
    res.clearCookie("phoneRegis");
    res.clearCookie("usernameRegis");
    res.clearCookie("passwordRegis");
    res.clearCookie("file_inputRegis");
    res.clearCookie("token");
    res.status(200).send("Cookies Cleared");
});

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

    sql = `Select * from user_job
            left join userdata
            on userdata.ID = user_job.ID
            left join studentdata
            on studentdata.email = userdata.email
            where job_type = ?
            `
    sql2 = `Select * from user_job
            right join userdata
            on userdata.ID = user_job.ID
            left join studentdata
            on studentdata.email = userdata.email
            where userdata.email = ?`
    if (!email) {
        return res.redirect("/home?error=106")//login first
    }
    pool.query(sql2, [email], (err, results) => {
        if (err) {
            console.log(err)
            res.redirect("/home?error=105")//wrong email
        } pool.query(sql, [jobType], (err, data) => {
            if (err) {
                console.log(err)
                res.redirect("/home?error=106")//input error
            }
            //res.json(data)
            res.render("jobtype/job_type", {
                userdata: results[0],
                post: data,
                jobtype: jobType
            })
        })
    })
})
router.get("/home/filter/:job_type/budget", (req, res) => {
    const { email } = req.cookies
    const jobType = req.params.job_type
    const budget = req.query.budget
    if (budget == "") {
        return res.redirect(`/home/filter/${jobType}`)
    }
    sql = `Select * from user_job
            left join userdata
            on userdata.ID = user_job.ID
            left join studentdata
            on studentdata.email = userdata.email
            where user_job.job_type = ? and user_job.budjet < ?
            `

    sql2 = `Select * from user_job
            right join userdata
            on userdata.ID = user_job.ID
            left join studentdata
            on studentdata.email = userdata.email
            where userdata.email = ?`
    if (!email) {
        return res.redirect("/home?error=106")//login first
    }
    pool.query(sql2, [email], (err, results) => {
        if (err) {
            console.log(err)
            res.redirect("/home?error=105")//wrong email
        } pool.query(sql, [jobType, budget], (err, data) => {
            if (err) {
                console.log(err)
                res.redirect("/home?error=106")//input error
            }
            //res.json(data)

            res.render("jobtype/job_type", {
                userdata: results[0],
                post: data,
                jobtype: jobType,
                budget: budget,
                currentUrl: req.originalUrl
            })
        })
    })
})
router.get("/home/filter/:job_type/:sort", (req, res) => {
    const { email } = req.cookies
    const jobType = req.params.job_type
    const sort = req.params.sort
    const budget = req.query.budget

    sql = `Select * from user_job
            left join userdata
            on userdata.ID = user_job.ID
            left join studentdata
            on studentdata.email = userdata.email
            where job_type = ? 
            `
    sql2 = `Select * from user_job
            right join userdata
            on userdata.ID = user_job.ID
            left join studentdata
            on studentdata.email = userdata.email
            where userdata.email = ?`
    let store = [email]
    if (budget) {
        sql += ` and user_job.budjet < ?`
        store.push(budget)
    }
    if (sort == "highlow") {
        sql += ` order by user_job.budjet asc`
    } else if (sort == "lowhigh") {
        sql += ` order by user_job.budjet desc`
    }
    if (!email) {
        return res.redirect("/home?error=106")//login first
    }
    pool.query(sql2, store, (err, results) => {
        if (err) {
            console.log(err)
            res.redirect("/home?error=105")//wrong email
        } pool.query(sql, [jobType, budget], (err, data) => {
            if (err) {
                console.log(err)
                res.redirect("/home?error=106")//input error
            }
            //res.json(data)
            res.render("jobtype/job_type", {
                userdata: results[0],
                post: data,
                jobtype: jobType,
                budget: budget,
                currentUrl: req.originalUrl
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