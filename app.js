const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const Database = require("./src/class/Database");
const RouterHandler = require("./src/class/RouterHandler");

const server = express();
const database = new Database("./src/db/web_cooperativa.db");
const routerHandler = new RouterHandler(server, database);

server.set("PORT", 5433);

server.use( express.static(join(__dirname, "src", "public") ));
server.use( express.static(join(__dirname, "src", "lib") ));

server.use( bodyParser.json() );
server.use( bodyParser.urlencoded({ extended: false }) );
server.use( cookieParser("test_123") );

/* server.use( require("./src/routers/main") ); */
routerHandler.loadRouter("./src/routers/main");

server.set("views", [ join(__dirname, "src", "views") ]);
server.set("database", database);

server.set("view engine", "ejs");
server.engine("html", require("ejs").renderFile);

(async function init() {
    await database.connect();

    server.listen(server.get("PORT"), () => {
        console.log(`\n\n\n\n\n\nIngrese en el navegador la siguiente URL: "localhost:${server.get("PORT")}"`);
    });
})();

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);