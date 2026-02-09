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

    console.log("Connected to database.");

    // Check if column exists
    const checkSql = `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '${process.env.dbname}' 
        AND TABLE_NAME = 'general_orders' 
        AND COLUMN_NAME = 'status'
    `;

    pool.query(checkSql, (err, res) => {
        if (err) {
            console.error("Error checking column:", err);
            pool.end();
            return;
        }

        if (res.length > 0) {
            console.log("Column 'status' already exists.");
            pool.end();
        } else {
            console.log("Column 'status' does not exist. Adding it...");
            // Add column with English values 'open' (default), 'closed'
            const alterSql = "ALTER TABLE general_orders ADD COLUMN status ENUM('open', 'closed') DEFAULT 'open'";
            pool.query(alterSql, (err, res) => {
                if (err) {
                    console.error("Error adding column:", err);
                } else {
                    console.log("Column 'status' added successfully.");
                }
                pool.end();
            });
        }
    });
});
