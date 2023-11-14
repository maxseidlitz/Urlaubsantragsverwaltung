const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const pool = require("./config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const auth = require("./middleware/auth");

app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json());

function generateSalt() {
  const saltRounds = 10; // The number of salt rounds
  return crypto.randomBytes(saltRounds).toString("hex"); // Generate a 32-character hexadecimal salt
}

async function authenticateUser(username) {
  return pool
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      if (result.rows.length === 1) {
        return user = result.rows[0];
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("Database error:", error);
      throw error;
    });
}

app.post("/register", (req, res) => {
  const { username, email, password, role, manager } = req.body;
  // Generate a random salt
  const salt = generateSalt();
  // Combine salt and password
  const saltedPassword = salt + password;

  // handle user registration, including password hashing and database insertion
  // Hash the user's password
  bcrypt.hash(saltedPassword, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      res.status(500).send("Registration failed");
    } else {
      // Store the username, email, and hashed password in the database
      const insertQuery =
        "INSERT INTO users (username, email, password_hash, password_salt, role, manager_id) VALUES ($1, $2, $3, $4, $5, $6)";
      const values = [username, email, hash, salt, role, manager];

      pool
        .query(insertQuery, values)
        .then(() => {
          // Registration successful; redirect to a login page or success page
          res.redirect("/login");
        })
        .catch((error) => {
          console.error("Error inserting into database:", error);
          res.status(500).send("Registration failed");
        });
      res.status(201).json({ message: "User registered successfully" });
    }
  });
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await authenticateUser(username);
    const storedHash = user.password_hash;
    const saltedPassword = user.password_salt + password;

    if (user && (await bcrypt.compare(saltedPassword, storedHash))) {
      // Create token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/login"); // Redirect to the login page
  });
});

app.post("/process_form", (req, res) => {
  const { startdatum, enddatum, urlaubsart, personalnummer, urlaubstage } =
    req.body;

  const request_id = "req" + personalnummer + new Date();
  const status = "beantragt";

  pool.query(
    "INSERT INTO public.vacation_request (request_id,user_id,start_date,end_date,vacation_days,status,vacation_type,reason,manager_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      request_id,
      "1",
      startdatum,
      enddatum,
      urlaubstage,
      status,
      urlaubsart,
      "Aufgrund von Umzug",
      3,
    ],
    (error, results) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error inserting data into the database");
      } else {
        res.status(200).send("Data inserted successfully");
      }
    }
  );
});

app.get("/main", auth, (req, res) => {
  // Serve the protected HTML file
  res.sendFile(__dirname + "/html/main.html");
});

app.get("/antrag_stellen", auth, (req, res) => {
  // Serve the protected HTML file
  res.sendFile(__dirname + "/html/antrag_stellen.html");
});

app.get("/login", (req, res) => {
  // Serve the protected HTML file
  res.sendFile(__dirname + "/html/login.html");
});

// Admin Panel route
app.get("/admin", (req, res) => {
  // Serve the HTML file for the admin panel
  res.sendFile(__dirname + "/html/admin.html");
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
