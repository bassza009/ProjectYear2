const express = require('express');
const router = express.Router();
const pool = require('../libs/mysql');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/imageForTest')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Route to show post work page
router.get('/create', (req, res) => {
    const email = req.cookies.email;

    if (!email) {
        return res.redirect('/login');
    }

    const sql = `SELECT * FROM userdata WHERE email = ?`;
    pool.query(sql, [email], (err, results) => {
        if (err) {
            console.log(err);
            return res.redirect('/home');
        }

        if (results.length === 0) {
            return res.redirect('/login');
        }

        res.render('post_work/postWork', { userdata: results[0] });
    });
});

// API to create job post
router.post('/create-job', upload.single('service_image'), (req, res) => {
    const { title, job_type, budjet, des_cription } = req.body;
    const email = req.cookies.email;

    if (!email) {
        return res.redirect('/login');
    }

    // Get user ID from email
    const getUserSql = `SELECT ID FROM userdata WHERE email = ?`;
    pool.query(getUserSql, [email], (err, userResults) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).send("Database Error");
        }

        if (userResults.length === 0) {
            return res.redirect('/login');
        }

        const userId = userResults[0].ID;
        const imageName = req.file ? req.file.filename : null;

        // Debug: Log received data
        console.log("Received form data:", req.body);
        console.log("job_type:", job_type);
        console.log("title:", title);
        console.log("budjet:", budjet);

        // Insert into user_job table - NOTE: Column name is JOb_type in DB, not job_type
        const sql = `INSERT INTO user_job 
                     (ID, JOb_type, title, budjet, des_Cription, service_image, job_create) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`;

        const values = [userId, job_type, title, budjet, des_cription, imageName];

        console.log("SQL Query:", sql);
        console.log("Values to insert:", values);

        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error("MySQL Error:", err);
                console.error("SQL:", sql);
                console.error("Values:", values);
                return res.status(500).send("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }

            console.log("บันทึกเรียบร้อย! ID:", result.insertId);

            // Verify what was actually saved
            const verifySql = `SELECT * FROM user_job WHERE job_id = ?`;
            pool.query(verifySql, [result.insertId], (verifyErr, verifyResult) => {
                if (!verifyErr && verifyResult.length > 0) {
                    console.log("ข้อมูลที่บันทึกจริงในDB:", verifyResult[0]);
                }
                res.redirect('/home');
            });
        });
    });
});

module.exports = router;