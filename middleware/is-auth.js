const jwt = require("jsonwebtoken");

const jwtSecret = "skdnguidfg";

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated!! no authHeader");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  console.log("token ::", token);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, jwtSecret);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not Authenticated!! no todecode token");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
