const { Router } = require("express");
const sessions = require("../modules/sessions");

const router = Router();

router.get("/", (req, res) => {
    res.render("index.html");
});

router.get("/panel/:username", (req, res) => {
    const username = req.params.username;

/*     if (!sessions.hasSession(username)) {
        return res.redirect("/");
    } */

    sessions.updateSession(username);

    res.render("panel.html", {
        userSession: username
    });
});

module.exports = router;