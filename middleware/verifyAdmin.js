const jwt = require("jsonwebtoken");

const config = process.env;

const verifyAdmin = (req, res, next) => {
  const cookieArray = req.headers.cookie.split(";");
  const role = cookieArray[1].split("role=")[1];

  if (!role) {
    return res.status(403).send("A role is required for authorization");
  }
  if (role === "Admin") {
    return next();
  } else {
    return res.status(401).send("Invalid Role");
  }
};

module.exports = verifyAdmin;