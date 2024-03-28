const { Router } = require("express");

const handler = Router();

handler.get("/api", (request, response) => {
    response.render("api-welcome.html");
});

module.exports = handler;