const jwt = require("jsonwebtoken");

const secret =
  process.env.JWS_SECRET || "e9rp^&^*&@9sejg)DSUA)jpfds8394jdsfn,m";

// secret + timestamp (see expiration) + userId == "oashdkjashdkjasbdkjbakdvqwkdvqkdbqwd";

// Doing login we use this
function toJWT(data) {
  return jwt.sign(data, secret, { expiresIn: "2h" }); // create a token
}

// To check tokens we use this
function toData(token) {
  return jwt.verify(token, secret); // verify and decode token
}

module.exports = { toJWT, toData };
