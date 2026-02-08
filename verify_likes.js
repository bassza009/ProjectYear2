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

    // 1. Check if table exists
    pool.query("SHOW TABLES LIKE 'review_likes'", (err, results) => {
        if (err) {
            console.error("Error checking table:", err);
            process.exit(1);
        }
        if (results.length > 0) {
            console.log("✅ Table 'review_likes' exists");
        } else {
            console.error("❌ Table 'review_likes' does NOT exist");
            process.exit(1);
        }

        // 2. Insert dummy like
        const reviewId = 99999;
        const userId = 88888;

        console.log("Testing Insert Like...");
        pool.query("INSERT INTO review_likes (review_id, user_id) VALUES (?, ?)", [reviewId, userId], (err) => {
            if (err) {
                console.error("❌ Insert failed (might already exist):", err.message);
            } else {
                console.log("✅ Insert Like success");
            }

            // 3. Verify Count
            pool.query("SELECT COUNT(*) as count FROM review_likes WHERE review_id = ?", [reviewId], (err, res) => {
                console.log("Current Likes for 99999:", res[0].count);

                // 4. Delete dummy like
                console.log("Testing Delete Like...");
                pool.query("DELETE FROM review_likes WHERE review_id = ? AND user_id = ?", [reviewId, userId], (err) => {
                    if (err) console.error("❌ Delete failed:", err);
                    else console.log("✅ Delete Like success");

                    pool.end();
                });
            });
        });
    });
});
