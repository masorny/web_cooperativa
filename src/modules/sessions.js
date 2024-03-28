const user_sessions = {};

const idle_time = 300_000;

function appendSession(username) {
    if (hasSession(username)) {
        return updateSession(username);
    }

    user_sessions[username] = setTimeout(() => revokeSession(username), idle_time);
    return true;
}

function updateSession(username) {
    clearTimeout(user_sessions[user_sessions]);

    user_sessions[username] = setTimeout(() => revokeSession(username), idle_time);

    console.log(`Updated session for ${username}`);
}

function revokeSession(username) {
    delete user_sessions[username];
}

function hasSession(username) {
    return username in user_sessions;
}

module.exports = {
    appendSession,
    updateSession,
    revokeSession,
    hasSession
}