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

// API to create job post for general users
router.post('/create-job', (req, res) => {
    const { title, job_type, budjet, des_cription, deadline } = req.body;
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

        // Debug: Log received data
        console.log("Received form data:", req.body);
        console.log("job_type:", job_type);
        console.log("title:", title);
        console.log("budjet:", budjet);
        console.log("deadline:", deadline);

        // Insert into general_orders table
        const sql = `INSERT INTO general_orders 
                     (general_id, orderType, title, budjet, des_cript, deadline, post_date) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`;

        const values = [userId, job_type, title, budjet, des_cription, deadline];

        console.log("SQL Query:", sql);
        console.log("Values to insert:", values);

        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error("MySQL Error:", err);
                console.error("SQL:", sql);
                console.error("Values:", values);
                return res.status(500).send("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }

            console.log("บันทึกเรียบร้อย! Order ID:", result.insertId);

            // Verify what was actually saved
            const verifySql = `SELECT * FROM general_orders WHERE order_ID = ?`;
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