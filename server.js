const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// PostgreSQL connection configuration
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
});

function getUserIDByUsername(username, callback) {
    const query = 'SELECT user_id FROM users WHERE username = $1';

    pool.query(query, [username], (error, result) => {
        if (error) {
            console.error('Error getting user_id:', error);
            callback(error, null);
        } else {
            if (result.rows.length === 0) {
                // Username not found
                console.error("Username not found");
                callback(null, null);
            } else {
                const user_id = result.rows[0].user_id;
                callback(null, user_id);
            }
        }
    });
}

app.post('/process_form', (req, res) => {
    const { startdatum, enddatum, urlaubsart, personalnummer, urlaubstage, status } = req.body;

    // const user_id = getUserIDByUsername(username);
    // const manager_id = getUserIDByUsername(username);
    const request_id = "req" + personalnummer + new Date();

    pool.query(
        'INSERT INTO public.vacation_request (request_id,user_id,start_date,end_date,vacation_days,status,vacation_type,reason,manager_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [request_id, 'user1', startdatum, enddatum, urlaubstage, status, urlaubsart, 'Aufgrund von Umzug', 'manager1'],
        (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                res.status(500).send('Error inserting data into the database');
            } else {
                res.status(200).send('Data inserted successfully');
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
