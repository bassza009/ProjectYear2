const mysql = require("mysql2");

require("dotenv").config({ path: "c:/Users/Windows/Desktop/67021499/New folder/67021499/ProjectYear2/.env" });

const pool = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.dbname
});

pool.connect((err) => {
    if (err) {
        console.error("Connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to DB");

    const studentId = 48; // Valid student ID
    const userId = 58;    // Valid user ID (viewer)

    const sql = `SELECT 
                    sr.review_id,
                    sr.rating,
                    sr.comment,
                    sr.review_image,
                    sr.review_date,
                    u.username,
                    u.profile_image,
                    sd.firstname,
                    sd.lastname,
                    u.roles,
                    (SELECT COUNT(*) FROM review_likes rl WHERE rl.review_id = sr.review_id) AS likes,
                    (SELECT COUNT(*) FROM review_likes rl WHERE rl.review_id = sr.review_id AND rl.user_id = ?) AS is_liked
                FROM service_reviews sr
                LEFT JOIN userdata u ON sr.reviewer_id = u.ID
                LEFT JOIN studentdata sd ON u.email = sd.email
                WHERE sr.student_id = ?
                ORDER BY likes DESC, sr.review_date DESC`

    // 1. Insert Like
    pool.query("INSERT INTO review_likes (review_id, user_id) VALUES (?, ?)", [5, userId], (err) => {
        if (err && err.code !== 'ER_DUP_ENTRY') console.error("Insert failed:", err);
        else console.log("Inserted Like");

        // 2. Fetch Reviews again
        pool.query(sql, [userId, studentId], (err, reviews) => {
            if (err) console.error(err);
            else {
                const r = reviews.find(r => r.review_id === 5);
                console.log("After Like:", { id: r.review_id, likes: r.likes, isLiked: r.is_liked });

                // 3. Delete Like
                pool.query("DELETE FROM review_likes WHERE review_id = ? AND user_id = ?", [5, userId], (err) => {
                    if (err) console.error("Delete failed:", err);
                    else console.log("Deleted Like");
                    pool.end();
                });
            }
        });
    });
});
