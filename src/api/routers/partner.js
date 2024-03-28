const { Router, response } = require("express");

const handler = Router();
const { client } = require("../../modules/dabataseUtils");

console.log("Loading partner api");

handler.get("/api/partner", async (request, response) => {
    const { dni } = request.query;

    if (!dni) {
        return response.status(400).send("SEARCH_NO_DNI");
    }

    const [ data ] = await client.query(`SELECT * FROM t_partner WHERE Dni = '${dni}'`);

    if (!data) {
        return response.status(404).send("PARTNER_NOT_FOUND");
    }

    response
        .status(200)
        .json(data);
});

handler.post("/api/partner", async (request, response) => {
    const {
        nombre,
        apellido,
        telefono,
        cedula,
        direccion
    } = request.body;

    if ([nombre, apellido, telefono, cedula, direccion].some(x => x.length === 0)) {
        return response.status(400).send("MUST_SPECIFY_DATA");
    }

    try {
        const [ data ] = await client.query(`SELECT * FROM t_partner WHERE Dni = ${cedula}`);

        if (data) {
            return response.status(409).send("ALREADY_EXISTS");
        }

        await client.query(`INSERT INTO t_partner (Name, LastName, Phone, Dni, Address, StatusId) VALUES ('${nombre}', '${apellido}', '${telefono}', ${cedula}, '${direccion}', 1)`)
        response.status(200).send("OK");
    }
    catch(err) {
        response.status(500).send("DATABASE_ERROR");
    }
});

handler.delete("/api/partner", async (request, response) => {
    const { dni } = request.body;

    if (!dni) {
        return response.status(400).send("NO_DNI_PROVIDED");
    }

    const [ data ] = await client.query(`SELECT * FROM t_partner WHERE Dni = ${dni}`);

    if (!data) {
        return response.status(404).send("NO_PARTNER_AVAILABLE");
    }

    try {
        await client.query(`DELETE FROM t_partner WHERE Dni = ${dni}`);
        response.status(200).send("OK");
    }
    catch {
        response.status(500).send("DATABASE_ERROR");
    }
});

handler.post("/api/partner-aporte", async (request, response) => {
    const {
        dni,
        aporte,
        saldo,
        fecha
    } = request.body;

    const regex = /^\d+$/g;

    if (dni.match(regex) === null || aporte.match(regex) === null || saldo.match(regex) === null) {
        return response.status(400).send("INVALID_VALUES");
    }

    const [data] = await client.query(`SELECT * FROM t_partner WHERE Dni = ${dni}`);

    if (!data) {
        return response.status(404).send("PARTNER_NOT_FOUND");
    }

    await client.query(`INSERT INTO t_partner_aporte(PartnerId, Aporte, Saldo, FechaCubierto, Deuda) VALUES (${data.Id}, ${aporte}, ${saldo}, '${fecha}')`);

    response.status(200).send("OK");
});

module.exports = handler;