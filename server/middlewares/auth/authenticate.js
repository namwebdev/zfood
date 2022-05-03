const jwt = require("jsonwebtoken");
const TOKEN_SECRET_KEY = require("../../constants");

const authenticate = (req, res, next) => {
  const token = req.header("token");
  try {
    const decode = jwt.verify(token, TOKEN_SECRET_KEY);
    if (decode) {
      req.user_id = decode.user_id;
      next();
    }
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authenticate };
