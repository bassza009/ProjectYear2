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

    const studentId = 48; // Valid student ID with reviews
    const viewerId = 58;  // Valid viewer ID (reviewer)

    const sqlReviews = `SELECT sr.*, 
                        userdata.username, userdata.profile_image,
                        sd.firstname, sd.lastname,
                        (SELECT COUNT(*) FROM review_likes rl WHERE rl.review_id = sr.review_id) AS likes,
                        (SELECT COUNT(*) FROM review_likes rl WHERE rl.review_id = sr.review_id AND rl.user_id = ?) AS is_liked
                        FROM service_reviews sr
                        LEFT JOIN userdata ON userdata.ID = sr.reviewer_id 
                        LEFT JOIN studentdata sd ON sd.email = userdata.email
                        WHERE sr.student_id = ? ORDER BY sr.review_date DESC`

    pool.query(sqlReviews, [viewerId, studentId], (err, reviews) => {
        if (err) {
            console.error("Error fetching reviews:", err);
        } else {
            console.log(`Fetched ${reviews.length} reviews`);
            if (reviews.length > 0) {
                console.log("Sample review:", reviews[0]);
            }
        }
        pool.end();
    });
});
