const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const pool = require("./db"); // Import the database connection
const session = require("express-session");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const app = express();
const port = 3000;
const saltRounds = 10; // The number of salt rounds

// Function to generate a secure session key
function generateSessionKey(length) {
  return crypto.randomBytes(length).toString("hex");
}

function generateSalt() {
  return crypto.randomBytes(saltRounds).toString("hex"); // Generate a 32-character hexadecimal salt
}

// Generate a session key of 64 characters
const sessionKey = generateSessionKey(32);

app.use(
  session({
    secret: sessionKey, // Change this to a strong and unique secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true for HTTPS
  }),
  bodyParser.urlencoded({ extended: false })
);

// If there is a site, that should be protected
function requireAuth(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated, proceed to the route
  } else {
    res.redirect("h/public/login.html"); // Redirect to the login page if not authenticated
  }
}

function getUserByUsername(username, callback) {
  const query = "SELECT * FROM users WHERE username = $1";

  pool.query(query, [username], (error, result) => {
    if (error) {
      console.error("Error getting user:", error);
      callback(error, null);
    } else {
      if (result.rows.length === 0) {
        // Username not found
        console.error("Username not found");
        callback(null, null);
      } else {
        return user = result.rows[0];
        callback(null, user);
      }
    }
  });
}

function authenticateUser(username, password) {
  return pool
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      if (result.rows.length === 1) {
        const user = result.rows[0];
        const storedHash = user.password_hash;
        const saltedPassword = user.password_salt + password;

        bcrypt.compare(saltedPassword, storedHash, (err, result) => {
          if (err) {
            console.error("Error comparing password:", err);
          } else if (result) {
            // Passwords match; user is authenticated
            return user;
          } else {
            // Passwords do not match; authentication failed
            return null;
          }
        });
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("Database error:", error);
      throw error;
    });
}

// Fetch user data (example)
app.get('/users', (req, res) => {
    // Implement logic to fetch user data from the database
    const users = getUserByUsername(req.user);
    res.json(users);
});

// Update user information (example)
app.put('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    const insertQuery =
      "INSERT INTO users (username, email, password_hash, password_salt, role, manager_id) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [username, email, hash, salt, role, manager];

    pool
      .query(insertQuery, values)
      .then(() => {
        // Registration successful; redirect to a login page or success page
        res.redirect("/public/login.html");
      })
      .catch((error) => {
        console.error("Error inserting into database:", error);
        res.status(500).send("Updating failed");
      });

    res.json({ success: true });
});

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
          res.redirect("/public/login.html");
        })
        .catch((error) => {
          console.error("Error inserting into database:", error);
          res.status(500).send("Registration failed");
        });
    }
  });
});

app.post("/login", (req, res) => {
  // Authenticate the user (e.g., using the database interaction code from a previous response)
  const user = authenticateUser();
  if (user) {
    req.session.user = user; // Store user data in the session
    res.redirect("/protected/main.html"); // Redirect to the user's dashboard
  } else {
    res.status(401).send("Login failed. Bitte überprüfe deine Zugangsdaten.");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/public/login"); // Redirect to the login page
  });
});

app.post("/process_form", (req, res) => {
  const {
    startdatum,
    enddatum,
    urlaubsart,
    personalnummer,
    urlaubstage,
  } = req.body;

  // const user_id = getUserIDByUsername(username);
  // const manager_id = getUserIDByUsername(username);
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
      3
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

app.get("/protected/main.html", requireAuth, (req, res) => {
  // Serve the protected HTML file
  res.sendFile(__dirname + "/protected/main.html");
});

app.get("/protected/antrag_stellen.html", requireAuth, (req, res) => {
  // Serve the protected HTML file
  res.sendFile(__dirname + "/protected/antrag_stellen.html");
});

app.get("/public/login.html", (req, res) => {
  // Serve the protected HTML file
  res.sendFile(__dirname + "/public/login.html");
});

// Admin Panel route
app.get("/protected/admin.html", (req, res) => {
  // Serve the HTML file for the admin panel
  res.sendFile(__dirname + "/protected/admin.html");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
