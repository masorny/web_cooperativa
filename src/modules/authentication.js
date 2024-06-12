const jwt = require("jsonwebtoken");

function __get_session_secret_key() {
    return "super_secret_key";
}

function encryptSession(id = 0, username = "", expiresAt = Date.now()) {
    const signed_token = jwt.sign({ id, username, expiresAt }, __get_session_secret_key(), { algorithm: "HS256" });
    return signed_token;
}

/**
 * Desencripta la sesion.
 * @param {string} token Token a desencriptar
 * @returns 
 */
function decryptSession(token) {
    const decoded = jwt.decode(token);

    if (!decoded)
        return null;

    return {
        id: Number(decoded.id),
        username: String(decoded.username),
        isExpired() {
            return Date.now() > Number(decoded.expiresAt);
        }
    }
}

module.exports = { encryptSession, decryptSession };