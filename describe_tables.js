const mysql = require("mysql2");
require("dotenv").config({ path: "c:/Users/Windows/Desktop/67021499/New folder/67021499/ProjectYear2/.env" });

const pool = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.dbname
});

pool.connect((err) => {
    if (err) { console.error(err); process.exit(1); }

    pool.query("DESCRIBE service_reviews", (err, res) => {
        if (err) console.error(err);
        else console.log("service_reviews:", res);

        pool.query("SHOW CREATE TABLE user_job", (err, res) => {
            if (err) console.error(err);
            else console.log("user_job:", res);
            pool.end();
        });
    });
});
