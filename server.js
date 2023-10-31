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

app.post('/process_form', (req, res) => {
    const { startdatum, enddatum, urlaubsart, personalnummer, urlaubstage } = req.body;
    const status = "beantragt";

    pool.query(
        'INSERT INTO public.urlaub (status,anfang,ende,art,personalnummer,summeTage) VALUES ($1, $2, $3, $4, $5, $6)',
        [status, startdatum, enddatum, urlaubsart, personalnummer, urlaubstage],
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
