const { Router } = require("express");
const dbUtils = require("../../modules/dabataseUtils");

const handler = Router();
const { client } = require("../../modules/dabataseUtils");
const { appendSession, hasSession, revokeSession } = require("../../modules/sessions");

console.log("Loading user api");

handler.get("/api/user", async (request, response) => {
    const { userPrompt, pwdPrompt } = request.query;

    if (!userPrompt && !pwdPrompt)
        return response.status(400).send("No has ingresado el usuario ni la contraseña.");

    const [ data ] = await client.query(`SELECT * FROM t_user WHERE Name = '${userPrompt}'`);

    if (!data)
        return response.status(404).send("No se ha encontrado el usuario.");

    const pwd = data.Pwd;

    if (pwd !== pwdPrompt)
        return response.status(401).send("La contraseña no es válida");

    appendSession(data.Name);
    
    response.status(200).send("OK");
});

handler.get("/api/user-end-session", (request, response) => {
    const { currentUser } = request.query;

    if (!currentUser)
        return response.status(400).send("NO_USER_PROVIDED");

    if (hasSession(currentUser))
        revokeSession(currentUser);

    response.status(200).send("OK");
});

module.exports = handler;