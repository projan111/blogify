const jwt = require("jsonwebtoken");

const secret = "@upermanFlyingHingInthe@k$";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
