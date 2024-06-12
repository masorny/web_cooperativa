const jwt = require("jsonwebtoken");

const jwt_options = {
    algorithm: "HS256"
};

function __get_session_secret_key() {
    return process.env.SESSION_SECRET_KEY;
}

/**
 * Encrypts the session.
 */
function encryptSession(id = 0, username = "", expiresAt = Date.now()) {
    const objectToSign = {
        id, 
        username, 
        expiresAt 
    };

    const signed_token = jwt.sign(
        objectToSign,
        __get_session_secret_key(),
        jwt_options
    );

    return signed_token;
}

/**
 * Desencripta la sesion.
 */
function decryptSession(token = "") {
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