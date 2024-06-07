const { Router } = require("express");
const sessions = require("../modules/sessions");
const { encryptSession, decryptSession } = require("../modules/authentication");

const router = Router();

router.get("/", (req, res) => {
    res.render("index.html");
});

router.post("/ingreso", async (req, res) => {
    const usuario = req.body.usuario,
        clavePass = req.body.clavePass;

    if (!usuario.match(/^[a-zA-Z1-9]+$/)) {
        return res.status(400).send("El nombre de usuario debe ser alfanumérico.");
    }

    /** @type {import("../class/Database")} */
    const database = req.app.get("database");

    const result = (await database.query(`select * from usuario where nombre = '${usuario}'`)).first();
    const id = Number(result?.id_usuario);
    const claveDb = result?.clave;

    if (!result) {
        return res.status(404).send("No se ha encontrado el usuario.");
    }

    if (clavePass != claveDb) {
        return res.status(401).send("La contraseña es incorrecta.");
    }

    const token_lifetime = 1;
    const token = encryptSession(id, usuario, Date.now() + token_lifetime * 1000 * 60);

    await database.query(`insert into usuario_sesion(id_usuario, codigo, valido) values (${id}, '${token}', 1)`);

    res.cookie("Authorization", token);
    res.set("location", "/inicio");
    res.status(301).send();
});

router.post("/salir", async (req, res) => {
    const token = req.cookies["Authorization"];

    /** @type {import("../class/Database")} */
    const database = req.app.get("database");

    await database.query(`update usuario_sesion set valido = 0 where codigo = '${token}'`);

    res.status(200).send("ok");
})

async function validateSession(request, response) {
    const token = request.cookies["Authorization"];
    const unsigned = decryptSession(token);

    if (!unsigned) {
        response.status(401).send(`
            <h1 style="margin-bottom: 0;">Invalid session.</h1>
            <h2 style="margin: 0; margin-top: 1px;"><a href=\"/\">Return to login.</a></h2>
        `);

        return false;
    }

    /** @type {import("../class/Database")} */
    const database = request.app.get("database");

    const tokenData = (await database.query(`select * from usuario_sesion where id_usuario = ${unsigned.id}`)).last();

    if (Date.now() > unsigned.expiresAt || tokenData?.valido == 0) {
        response.redirect("/");
        return false;
    }

    return true;
}

router.get("/inicio", async (req, res) => {
    const token = req.cookies["Authorization"];

    if (! (await validateSession(req, res)) )
        return;

    /** @type {import("../class/Database")} */
    const database = req.app.get("database")

    const session = decryptSession(token);
    const usuario = (await database.query(`select * from usuario where id_usuario = ${session.id}`)).first();

    res.render("dashboard.html", { usuario, firstStep: usuario.primera_vez == 0 ? false : true });
});

router.get("/listaFuncionarios", async (req, res) => {
    const token = req.cookies["Authorization"];

    if (! (await validateSession(req, res)) )
        return;

    const session = decryptSession(token);

    /** @type {import("../class/Database")} */
    const database = req.app.get("database")

    const usuario = (await database.query(`select * from usuario where id_usuario = ${session.id}`)).first();

    res.render("dashboard.html", {
        title: "Lista de Funcionarios",
        usuario
    });
});

router.get("/nosotros", async (req, res) => {
    const token = req.cookies["Authorization"];

    if (! (await validateSession(req, res)) )
        return;

    const session = decryptSession(token);

    /** @type {import("../class/Database")} */
    const database = req.app.get("database")

    const usuario = (await database.query(`select * from usuario where id_usuario = ${session.id}`)).first();

    res.render("dashboard.html", {
        title: "Sobre Nosotros",
        usuario
    });
});

router.get("/configuracion", async (req, res) => {
    const token = req.cookies["Authorization"];

    if (! (await validateSession(req, res)) )
        return;

    const session = decryptSession(token);

    /** @type {import("../class/Database")} */
    const database = req.app.get("database")

    const usuario = (await database.query(`select * from usuario where id_usuario = ${session.id}`)).first();

    res.render("dashboard.html", {
        title: "Mis Preferencias",
        usuario
    });
});

router.get("/perfil", async (req, res) => {
    const token = req.cookies["Authorization"];

    if (! (await validateSession(req, res)) )
        return;

    const session = decryptSession(token);

        /** @type {import("../class/Database")} */
    const database = req.app.get("database")

    const usuario = (await database.query(`select * from usuario where id_usuario = ${session.id}`)).first();

    res.render("dashboard.html", {
        title: "Mi Perfil",
        usuario
    });
});

router.post("/primerpaso", async (req, res) => {
    const token = req.cookies["Authorization"];
    const apodo = req.body.apodo;

    /* if (! (await validateSession(req, res)) )
        return; */

    const session = decryptSession(token);

    /** @type {import("../class/Database")} */
    const database = req.app.get("database");

    await database.query(`update usuario set primera_vez = 0, apodo = '${apodo}' where id_usuario = ${session.id}`);

    res.status(200).send("ok");
});

/* router.get("/panel/:username", (req, res) => {
    const username = req.params.username;

    if (!sessions.hasSession(username)) {
        return res.redirect("/");
    }

    sessions.updateSession(username);

    res.render("panel.html", {
        userSession: username
    });
}); */

module.exports = router;