const jwt = require("jsonwebtoken");

function __get_session_secret_key() {
    return "super_secret_key";
}

function encryptSession(id = 0, username = "", expiresAt = Date.now()) {
    const signed_token = jwt.sign({ id, username, expiresAt }, __get_session_secret_key(), { algorithm: "HS256" });
    return signed_token;
}

function decryptSession(token) {
    return jwt.decode(token);
}

module.exports = { encryptSession, decryptSession };