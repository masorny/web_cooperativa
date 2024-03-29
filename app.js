const express = require("express");
const bodyParser = require("body-parser");
const { join } = require("path");
const installAPI = require("./src/api/routerSetup");
const dbUtils = require("./src/modules/dabataseUtils");

const server = express();

server.set("PORT", 5432);

server.use(express.static(join(__dirname, "src", "public")));
server.use(express.static(join(__dirname, "src", "lib")));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(require("./src/routers/main"));

server.set("views", [ join(__dirname, "src", "views"), join(__dirname, "src", "api", "views") ]);

server.set("view engine", "ejs");
server.engine("html", require("ejs").renderFile);

installAPI(server);
dbUtils.makeConnection().catch(err => console.log(err));

server.listen(server.get("PORT"), () => {
    console.log(`\n\n\n\n\n\nIngrese en el navegador la siguiente URL: "localhost:${server.get("PORT")}"`);
});