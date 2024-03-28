const router1 = require("./routers/main");
const router2 = require("./routers/partner");
const router3 = require("./routers/user");

/**
 * @typedef {import("express").Express} ExpressServer 
 */

/**
 * Adjunta los routers de la API al servidor.
 * @param {ExpressServer} server El servidor.
 */
module.exports = function installAPI(server) {
    server.use(router1);
    server.use(router2);
    server.use(router3);

    console.log("Web API has installed successfully.");
}