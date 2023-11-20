const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const cookieArray = req.headers.cookie.split(";");
  var token = '';
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    // Check if this is the cookie we're looking for
    if (cookie.startsWith("token" + "=")) {
      token = cookie.split("token=")[1];
    }
  }

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;
