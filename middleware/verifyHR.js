const verifyHR = (req, res, next) => {
  const cookieArray = req.headers.cookie.split(";");
  var role = '';
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    // Check if this is the cookie we're looking for
    if (cookie.startsWith("role" + "=")) {
      role = cookie.split("role=")[1];
    }
  }

  if (!role) {
    return res.status(403).send("A role is required for authorization");
  }
  if (role === "HR") {
    return next();
  } else {
    return res.status(401).send("Invalid Role");
  }
};

module.exports = verifyHR;
