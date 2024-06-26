const { encryptSession, decryptSession } = require("../modules/authentication");
const db = require("sqlite3-transactions");

const devMode = false;

/**
 * Initializes a route.
 * @param {import("express").Router} router The router provided to handle.
 * @param {import("../class/Database")} database The database instance. 
 */
function initializeRoute(router, database) {
    const token_lifetime = 30; // Duración del token en minutos.

    const MillisecondsFrom = {
        SECOND: 0,
        MINUTE: 1,
        HOUR: 2,
        DAY: 3
    };

    const html_invalid_session_view = `
        <h1 style="margin-bottom: 0;">Invalid session.</h1>
        <h2 style="margin: 0; margin-top: 1px;"><a href=\"/\">Return to login.</a></h2>
    `;

    const Path = {
        DEFAULT_USER_IMAGE: `/img/funcionarios/default.jpg`,
        USER_IMAGES: (foto) => `/img/funcionarios/${foto}`
    };

    // Pagina de login.
    router.get("/", async (req, res, next) => {
        /* if (validateSession(req, res, next)) {
            res.status(301).redirect("/inicio");
        } */

        const token = req.cookies["Authorization"];
        
        if (token) {
            const session = decryptSession(token);

            if (!session) {
                return res.render("index.html", { config: {} });
            }

            const usuario = await getUser(session.id);

            const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

            return res.render("index.html", { config });
        }

        res.render("index.html", { config: {} });
    });
    
    // Recibe el login del funcionario.
    router.post("/ingreso", async (req, res) => {
        const usuario = req.body.usuario, clavePass = req.body.clavePass;
    
        if ( !isValidUsername(usuario) ) {
            return res.status(400).send("El nombre de usuario debe ser alfanumérico.");
        }
    
        const result = await getUser(usuario);
    
        if ( !result )
            return res.status(404).send("No se ha encontrado el usuario.");
    
        if ( !result.isValidPwd(clavePass) )
            return res.status(401).send("La contraseña es incorrecta.");

        const token = encryptSession(
            result.id, 
            usuario, 
            Date.now() + toMilliseconds(token_lifetime, MillisecondsFrom.MINUTE)
        );
    
        await database.query(`insert into usuario_sesion(id_usuario, codigo, valido) values (${result.id}, '${token}', 1)`);
    
        res.cookie("Authorization", token);
        res.set("location", "/inicio");
        res.status(301).send();
    });

    router.post("/registro", async (req, res) => {
        const form = req.body;
        
        const datos = {
            cod_autorizacion: form["cod_autorizacion"],
            usuario: form["usuario"],
            clave: form["clave"],
            claveConfirmacion: form["claveConfirmacion"]
        };

        var existe = (await database.query(`select * from usuario where cod_autorizacion = ${datos.cod_autorizacion}`)).first();

        // El codigo de autorizacion ya fue utilizado en otro registro.
        if (existe && existe?.nombre != undefined) {
            return res.status(401).send("El código de autorización especificado ya se ha utilizado.");
        }

        // El codigo de autorizacion no existe. 
        else if (!existe) {
            return res.status(401).send("El código de autorización no existe.");
        }

        existe = (await database.query(`select * from usuario where nombre = '${datos.usuario}'`)).first();

        if (existe) {
            return res.status(401).send("Ya existe el nombre de usuario escrito, utiliza otro nombre distinto.");
        }

        if (datos.clave != datos.claveConfirmacion) {
            return res.status(401).send("Las contraseñas no coinciden.");
        }

        await database.query(`update usuario set nombre = '${datos.usuario}', clave = '${datos.clave}' where cod_autorizacion = ${datos.cod_autorizacion}`);

        const nuevoUsuario = (await database.query(`select * from usuario where cod_autorizacion = ${datos.cod_autorizacion}`)).first();

        const token = encryptSession(
            nuevoUsuario.id_usuario, 
            nuevoUsuario.nombre,
            Date.now() + toMilliseconds(token_lifetime, MillisecondsFrom.MINUTE)
        );
    
        await database.query(`insert into usuario_sesion(id_usuario, codigo, valido) values (${nuevoUsuario.id_usuario}, '${token}', 1)`);
    
        res.cookie("Authorization", token);
        res.set("location", "/inicio");
        res.status(301).send();
    });
    
    router.post("/salir", async (req, res) => {
        const token = req.cookies["Authorization"];
    
        await closeSession(token);
    
        res.status(200).send("ok");
    })
    
    // Página principal de dashboard.
    router.get("/inicio", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];
    
        const session = decryptSession(token);
        const usuario = (await database.query(`select * from usuario where id_usuario = ${session.id}`)).first();
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id_usuario}`)).first();
    
        res.render("dashboard.html", {
            usuario, 
            firstStep: parseBoolean( usuario.primera_vez ),
            config
        });
    });
    
    // Listado de funcionarios y sus roles.
    router.get("/listaFuncionarios", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];
    
        const session = decryptSession(token);    
        const usuario = await getUser(session.id);
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        if (usuario.primera_vez == 1) {
            return res.redirect("/inicio");
        }

        const funcionarios = await getUsers();

        res.render("dashboard.html", {
            title: "Lista de Funcionarios",
            usuario,
            funcionarios,
            config
        });
    });

    router.post("/listaFuncionarios", validateSession, async (req, res) => {
        const form = req.body;
        const usuario = await getUser( form["id"] );

        const datos = {
            nombre: (form["nombre"] == usuario.nombre ? null : form["nombre"]) ?? null,
            apodo: (form["apodo"] == usuario.apodo ? null : form["apodo"]) ?? null,
            estado: (Number(form["estado"]) == usuario.estado ? null : Number(form["estado"])) ?? null,
            password_actualizar: form["password_actualizar"] || null,
            permiso_1: parseBoolean(form["permiso_1"]) ?? false, // Control total
            permiso_2: parseBoolean(form["permiso_2"]) ?? false, // Gestionar funcionarios
            permiso_3: parseBoolean(form["permiso_3"]) ?? false, // Gestionar movimientos
            permiso_4: parseBoolean(form["permiso_4"]) ?? false, // Gestionar aportes
            permiso_5: parseBoolean(form["permiso_5"]) ?? false  // Gestionar ahorros
        };

        var qSql = [];

        if (datos.nombre) qSql.push(`usuario = '${datos.nombre}'`);
        if (datos.apodo) qSql.push(`apodo = '${datos.apodo}'`);
        if (datos.estado != null) qSql.push(`estado = '${datos.estado}'`);
        if (datos.password_actualizar) qSql.push(`clave = '${datos.password_actualizar}'`);

        qSql = qSql.join(", ");

        // Inicializar transacción.
        const transaction = new db.TransactionDatabase(database.connection);

        transaction.beginTransaction(async (err, transaction) => {
            try {
                if (err)
                    return console.log(err);

                // Actualizar nombre, apodo, estado y/o contraseña.
                if (qSql.length > 0) {
                    await transaction.run(`update usuario set ${qSql} where id_usuario = ${usuario.id}`);
                }
    
                // insert into usuario_asignacion_roles(id_usuario, id_rol) values ()
                qSql = [];

                if (datos.permiso_1) qSql.push(1); // Control total
                if (datos.permiso_2) qSql.push(2); // Gestionar funcionarios
                if (datos.permiso_3) qSql.push(3); // Gestionar movimientos
                if (datos.permiso_4) qSql.push(4); // Gestionar aportes
                if (datos.permiso_5) qSql.push(5); // Gestionar ahorros

                qSql = qSql.map(permiso => `(${usuario.id}, ${permiso})`);
                qSql.join(", ");
                
                if (qSql.length > 0) {
                    await transaction.run(`delete from usuario_roles_asignacion where id_usuario = ${usuario.id}`);
                    await transaction.run(`insert into usuario_roles_asignacion(id_usuario, id_rol) values ${qSql}`);
                }
    
                if (req.file) {
                    const filename = req.file.originalname;
                    const existe = (await database.query(`select * from usuario_foto where id_usuario = ${usuario.id}`)).first();
    
                    if (!existe) {
                        await transaction.run(`insert into usuario_foto(id_usuario, url) values (${usuario.id}, '${filename}')`);
                    }
                    else {
                        await transaction.run(`update usuario_foto set url = '${filename}' where id_usuario = ${usuario.id}`);
                    }
                }

                transaction.commit(function(err) {
                    if (err)
                        console.log(err);

                    res.status(301).redirect("/listaFuncionarios");
                });
            }
            catch {
                transaction.rollback();
                res.status(500);
            }
        });
    });
    
    router.get("/nosotros", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);    
        const usuario = (await database.query(`select * from usuario where id_usuario = ${session.id}`)).first();
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id_usuario}`)).first();

        if (usuario.primera_vez == 1) {
            return res.redirect("/inicio");
        }
    
        res.render("dashboard.html", {
            title: "Sobre Nosotros",
            usuario,
            config
        });
    });
    
    router.get("/configuracion", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];
    
        const session = decryptSession(token);
        const usuario = await getUser(session.id);
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        if (usuario.primera_vez == 1) {
            return res.redirect("/inicio");
        }
    
        res.render("dashboard.html", {
            title: "Mis Preferencias",
            usuario,
            config
        });
    });

    router.post("/configuracion", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);

        const datos = req.body;
        const temaColor = datos["theme"];

        const existe = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        if (existe) {
            await database.query(`update usuario_config set color_tema = ${temaColor} where id_usuario = ${usuario.id}`);
        }
        else {
            await database.query(`insert into usuario_config(id_usuario, color_tema) values (${usuario.id}, ${temaColor})`);
        }

        res.status(301).redirect("/configuracion");
    });
    
    router.get("/perfil", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);

        if (usuario.primera_vez == 1) {
            return res.redirect("/inicio");
        }
    
        res.render("dashboard.html", {
            title: "Mi Perfil",
            usuario
        });
    });
    
    router.post("/primerpaso", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];
        const apodo = req.body.apodo;

        if (!apodo) {
            res.status(301).redirect("/inicio");
            return;
        }
    
        const session = decryptSession(token);

        await completeFirstStep(session.id, apodo);
    
        res.status(200).send("ok");
    });

    router.get("/movimientos", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);
        
        res.render("dashboard.html", {
            title: "Movimientos",
            usuario
        });
    });

    router.get("/aportes", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        res.render("dashboard.html", {
            title: "Aportes",
            usuario,
            config
        });
    });

    router.post("/aportes", validateSession, async (req, res) => {
        const form = req.body;

        const datos = {
            id: form["socio"],
            monto: form["monto"]
        };

        if (datos.id != undefined) {
            const fecha_actual = new Date(),
            formatNumber = (x) => x < 10 ? `0${x}` : x,
            formato_fecha_actual = `${formatNumber(fecha_actual.getDate())}-${formatNumber(fecha_actual.getMonth() + 1)}-${fecha_actual.getFullYear()}`;

            await database.query(`insert into aporte(Socio_Id, Monto, Fecha) values(${datos.id}, ${datos.monto}, '${formato_fecha_actual}')`);
        }

        return res.status(301).redirect("/aportes");
    });

    router.get("/ahorros", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        res.render("dashboard.html", {
            title: "Ahorros",
            usuario,
            config
        });
    });

    router.post("/ahorros", validateSession, async (req, res) => {
        const form = req.body;

        const datos = {
            id: form["socio"],
            tipo_ahorro: form["tipo_ahorro"],
            monto: form["monto"]
        };

        if (datos.id != undefined) {
            await database.query(`insert into ahorro(Socio_id, Monto, Tipo_ahorro_id) values(${datos.id}, ${datos.monto}, ${datos.tipo_ahorro})`);
        }

        return res.status(301).redirect("/ahorros");
    });

    router.get("/prestamos", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        res.render("dashboard.html", {
            title: "Prestamos",
            usuario,
            config
        });
    });

    router.post("/prestamos", validateSession, async (req, res) => {
        const form = req.body;

        const datos = {
            id: form["socio"],
            tipo_prestamo: form["tipo_prestamo"],
            monto: form["monto"]
        };

        if (datos.id != undefined) {
            const fecha_actual = new Date(),
            formatNumber = (x) => x < 10 ? `0${x}` : x,
            formato_fecha_actual = `${formatNumber(fecha_actual.getDate())}-${formatNumber(fecha_actual.getMonth() + 1)}-${fecha_actual.getFullYear()}`;

            console.log(`values(${datos.id}, ${datos.monto}, '${formato_fecha_actual}', ${datos.tipo_prestamo})`);

            await database.query(`insert into prestamo(Socio_id, Monto, Fecha, Tipo_prestamo_id) values(${datos.id}, ${datos.monto}, '${formato_fecha_actual}', ${datos.tipo_prestamo})`);
        }

        return res.status(301).redirect("/prestamos");
    });

    router.get("/pagos", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        res.render("dashboard.html", {
            title: "Pagos",
            usuario,
            config
        });
    });

    router.post("/pagos", validateSession, async (req, res) => {
        const form = req.body;

        const datos = {
            id_prestamo: form["id_prestamo"],
            monto: form["monto"]
        };

        const fecha_actual = new Date(),
        formatNumber = (x) => x < 10 ? `0${x}` : x,
        formato_fecha_actual = `${formatNumber(fecha_actual.getDate())}-${formatNumber(fecha_actual.getMonth() + 1)}-${fecha_actual.getFullYear()}`;

        await database.query(`insert into pago_prestamo(Fecha, Monto, Prestamo_Id) values('${formato_fecha_actual}', ${datos.monto}, ${datos.id_prestamo})`);

        return res.status(301).redirect("/pagos");
    });

    router.get("/socios", validateSession, async (req, res) => {
        const token = req.cookies["Authorization"];

        const session = decryptSession(token);
        const usuario = await getUser(session.id);
        const config = (await database.query(`select * from usuario_config where id_usuario = ${usuario.id}`)).first();

        const socios = (await database.query("select * from socio")).all();

        res.render("dashboard.html", {
            title: "Socios",
            usuario,
            socios,
            config
        });
    });

    router.post("/socios", validateSession, async (req, res) => {
        const form = req.body;
        const id = form["id"];

        const socio = (await database.query(`select * from socio where Id_socio = ${id}`)).first();

        const datos = {
            nombre: distinct(form["nombre"], socio?.nombre),
            apellido: distinct(form["apellido"], socio?.apellido),
            direccion: distinct(form["direccion"], socio?.direccion),
            ciudad: distinct(form["ciudad"], socio?.ciudad),
            cedula: distinct(form["cedula"], socio?.cedula),
            correo: distinct(form["correo"], socio?.correo),
            telefono: distinct(form ["telefono"], socio?.telefono)
        };

        if (id == -1) {
            const fecha_actual = new Date(),
            formatNumber = (x) => x < 10 ? `0${x}` : x,
            formato_fecha_actual = `${formatNumber(fecha_actual.getDate())}-${formatNumber(fecha_actual.getMonth() + 1)}-${fecha_actual.getFullYear()}`;

            await database.query(`
                insert into socio(nombre, apellido, direccion, ciudad, cedula, correo, telefono, fecha_ingreso) values 
                ('${datos.nombre}', '${datos.apellido}', '${datos.direccion}', '${datos.ciudad}', ${datos.cedula}, '${datos.correo}', ${datos.telefono}, '${formato_fecha_actual}')
            `);
        }

        var qSql = [];

        if (datos.nombre) qSql.push(`nombre = '${datos.nombre}'`);
        if (datos.apellido) qSql.push(`apellido = '${datos.apellido}'`);
        if (datos.direccion) qSql.push(`direccion = '${datos.direccion}'`);
        if (datos.ciudad) qSql.push(`ciudad = '${datos.ciudad}'`);
        if (datos.cedula) qSql.push(`cedula = ${datos.cedula}`);
        if (datos.correo) qSql.push(`correo = '${datos.correo}'`);
        if (datos.telefono) qSql.push(`telefono = '${datos.telefono}'`);

        if (qSql.length > 0) {
            qSql = qSql.join(", ");
            await database.query(`update socio set ${qSql} where Id_socio = ${id}`);
        }

        res.status(301).redirect("/socios");
    });

    router.get("/obtenerAporte", validateApiSession, async (req, res) => {
        const busqueda = req.query.busqueda;

        var qSql = `select * from aporte a inner join socio s on s.Id_socio = a.Socio_id`, aportes;

        if (!busqueda.match(/^\d+$/g)) {
            aportes = (await database.query(`${qSql} where (nombre || ' ' || apellido) like '%${busqueda}%'`)).all();
        }
        else {
            aportes = (await database.query(`${qSql} where Socio_Id = ${busqueda} or cedula = ${busqueda}`)).all();
        }

        aportes = aportes.sort((a, b) => b.Id_aporte - a.Id_aporte);

        res.render("socio-aporte.html", { aportes });
    });

    router.get("/obtenerAhorro", validateApiSession, async (req, res) => {
        const busqueda = req.query.busqueda;

        var ahorros, qSql = `select * from v_ahorro`;

        if (!busqueda.match(/^\d+$/g)) {
            ahorros = (await database.query(`${qSql} where (nombre || ' ' || apellido) like '%${busqueda}%'`)).all();
        }
        else {
            ahorros = (await database.query(`${qSql} where Socio_Id = ${busqueda} or cedula = ${busqueda}`)).all();
        }

        ahorros = ahorros.sort((a, b) => a.Id_ahorro - b.Id_ahorro);

        res.render("socio-ahorro.html", { ahorros });
    });

    router.get("/obtenerPrestamo", validateApiSession, async (req, res) => {
        const busqueda = req.query.busqueda;

        var prestamos, qSql = `select * from v_prestamo`;

        if (!busqueda.match(/^\d+$/g)) {
            prestamos = (await database.query(`${qSql} where (nombre || ' ' || apellido) like '%${busqueda}%'`)).all();
        }
        else {
            prestamos = (await database.query(`${qSql} where Socio_Id = ${busqueda} or cedula = ${busqueda}`)).all();
        }

        prestamos = prestamos.sort((a, b) => a.Id_prestamo - b.Id_prestamo);

        res.render("socio-prestamo.html", { prestamos });
    });

    router.get("/obtenerPagoPrestamo", validateApiSession, async (req, res) => {
        const busqueda = req.query.busqueda;

        var pagoPrestamos, qSql = `select * from v_pago_socio`;

        if (!busqueda.match(/^\d+$/g)) {
            pagoPrestamos = (await database.query(`${qSql} where (nombre || ' ' || apellido) like '%${busqueda}%'`)).all();
        }
        else {
            pagoPrestamos = (await database.query(`${qSql} where Socio_Id = ${busqueda} or cedula = ${busqueda}`)).all();
        }

        pagoPrestamos = pagoPrestamos.sort((a, b) => a.Id_pago_prestamo - b.Id_pago_prestamo);

        res.render("socio-pago-prestamo.html", { pago_prestamos: pagoPrestamos });
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const TokenStatus = {
        OK: 0,
        INVALID: 1,
        EXPIRED: 2
    };;;;;;;;;;;;;;;;;;;;

    /**
     * Inspects the token given from request.
     */
    async function inspectToken(req) {
        if (devMode) {
            return TokenStatus.OK;
        }

        const token = req.cookies["Authorization"];
        const decodedToken = decryptSession(token);

        if (!decodedToken) {
            return TokenStatus.INVALID;
        }

        const tokenData = await getUserSession( decodedToken.id );

        if ( decodedToken.isExpired() || !tokenData.isValid() ) {
            return TokenStatus.EXPIRED;
        }

        return TokenStatus.OK;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    router.get("/api", validateApiSession, async (req, res, next) => {
        const tokenInspected = await inspectToken(req);

        if (tokenInspected == TokenStatus.EXPIRED || tokenInspected == TokenStatus.INVALID) {
            return res.send("No se ha podido autenticar su sesión.");
        }

        res.send(".");
    });

    router.get("/api/funcionario", validateApiSession, async (req, res) => {
        const idFuncionario = req.query["id"];

        var funcionario = (await database.query(`select * from v_usuario where id = ${idFuncionario}`)).first();

        console.log(funcionario)

        const permisos = (await database.query(`select id_rol from usuario_roles_asignacion where id_usuario = ${idFuncionario}`))
            .all()
            .map(permiso => ({ [`permiso_${permiso.id_rol}`]: true }));

        funcionario = Object.assign(funcionario, ...permisos);
        res.json(funcionario);
    });

    router.get("/api/crearfuncionario", validateApiSession, async (req, res) => {
        const cod_autorizaciones = (await database.query("select cod_autorizacion from usuario"))
            .all()
            .map(obj => obj.cod_autorizacion);

        var cod_autorizacion = ~~(Math.random() * 1000000);

        while(cod_autorizaciones.includes(cod_autorizacion)) {
            cod_autorizacion = ~~(Math.random() * 1000000);
        }

        await database.query(`insert into usuario (estado, cod_autorizacion) values (1, ${cod_autorizacion})`);

        res.json(cod_autorizacion);
    });

    router.get("/api/socio", validateApiSession, async (req, res) => {
        const idSocio = req.query["id"];

        var socio = (await database.query(`select * from socio where Id_socio = ${idSocio}`)).first();

        res.json(socio);
    });

    router.get("/api/socios", validateApiSession, async (req, res) => {
        const socios = (await database.query("select * from socio")).all();

        res.json(socios);
    });

    router.get("/api/socioPrestamo", validateApiSession, async (req, res) => {
        const id = req.query.id;

        const prestamos = (await database.query(`select * from prestamo p
            inner join tipo_prestamo tp on p.Tipo_prestamo_id = tp.Id_tipo_prestamo
            inner join socio s on p.Socio_id = s.Id_socio
            where Socio_id = ${id}
        `)).all();

        res.json(prestamos);
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function validateSession(request, response, next) {
        const tokenInspected = await inspectToken(request);
    
        if ( tokenInspected == TokenStatus.INVALID ) {
            response.status(401).send(html_invalid_session_view);    
            return false;
        };
    
        if ( tokenInspected == TokenStatus.EXPIRED ) {
            const token = request.cookies["Authorization"];

            await closeSession(token);
            response.redirect("/");

            return false;
        }

        next();
        return true;
    }

    async function validateApiSession(request, response, next) {
        const tokenInspected = await inspectToken(request);
    
        if ( tokenInspected == TokenStatus.INVALID || tokenInspected == TokenStatus.EXPIRED ) {
            response.status(401).send("No se pudo autenticar la sesión.");
            return false;
        };

        next();
        return true;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function distinct(data, evaluator) {
        if (data == evaluator) {
            return null;
        }

        return data;
    }

    /**
     * Retorna los datos del usuario mediante su identificador, caso contrario, devuelve nulo.
     * @param {string|number} userNameOrId El identificador del usuario.
     */
    async function getUser(userNameOrId) {
        try {
            const q = !isNaN(Number(userNameOrId))
                ? `select * from usuario where id_usuario = ${userNameOrId}`
                : `select * from usuario where nombre = '${userNameOrId}'`;

            const usuario = (await database.query(q)).first();

            const ultima_sesion = (await database.query(`select * from usuario_ingreso where id_usuario = ${usuario.id_usuario}`)).last();

            return {
                /**
                 * Identificador del usuario.
                 */
                id: Number( usuario.id_usuario ),
                /**
                 * Nombre de usuario.
                 */
                nombre: String( usuario.nombre ),
                /**
                 * Apodo o alias del usuario.
                 */
                apodo: String( usuario.apodo ),
                /* clave: usuario.clave, */
                /**
                 * Estado de la cuenta de usuario.
                 */
                estado: Number( usuario.estado ),
                /**
                 * El usuario se ha registrado recientemente.
                 */
                primera_vez: Number( usuario.primera_vez ),
                /**
                 * Codigo de autorización de 6 dígitos.
                 */
                cod_autorizacion: Number( usuario.cod_autorizacion ),

                /**
                 * Valida si la contraseña ingresada es valida para este usuario.
                 * @param {string} pwdInput Contraseña ingresada para validar.
                 */
                isValidPwd(pwdInput) {
                    return usuario.clave == pwdInput;
                },

                lastSession() {
                    return ultima_sesion.fecha_ingreso;
                }
            };
        }
        catch(err) {
            return null;
        }
    }

    /**
     * Obtiene la sesión del usuario mediante su token.
     * @param {string|number} tokenOrUserId Token de sesión o el identificador de usuario.
     */
    async function getUserSession(tokenOrUserId) {
        try {
            const usuario_sesion = (await database.query(`select * from usuario_sesion where id_usuario = ${tokenOrUserId} or codigo = '${tokenOrUserId}'`)).last();

            return {
                id_sesion: Number( usuario_sesion.id_sesion ),
                id_usuario: Number( usuario_sesion.id_usuario ),
                token: String( usuario_sesion.token ),
                isValid() {
                    return Number( usuario_sesion.valido ) == 1;
                }
            };
        }
        catch {
            return null;
        }
    }

    async function getUsers() {
        try {
            const usuarios = (await database.query("select id_usuario, nombre, apodo from usuario")).all();

            return await Promise.all(usuarios.map(async usuario => {
                const ultima_sesion = (await database.query(`select * from usuario_ingreso where id_usuario = ${usuario.id_usuario}`)).last();

                return {
                    ...usuario,
                    lastSession() {
                        return ultima_sesion?.fecha_ingreso ?? "";
                    }
                }
            }));
        }
        catch {
            return [];
        }
    }

    /**
     * Obtiene la foto del funcionario mediante su identificador.
     * @param {number} funcionarioId Identificador del funcionario.
     */
    async function getImage(funcionarioId) {
        try {
            const foto = (await database.query(`select url from usuario_foto where id_usuario = ${ Number(funcionarioId) }`)).first();

            if (!foto)
                return Path.DEFAULT_USER_IMAGE;

            return Path.USER_IMAGES(foto.url);
        }
        catch {
            return Path.DEFAULT_USER_IMAGE;
        }
    }

    /**
     * Cierra la sesion del usuario.
     * @param {string} token Token de sesión a finalizar.
     */
    async function closeSession(token) {
        await database.query(`update usuario_sesion set valido = 0 where codigo = '${token}'`);
    }
    
    async function renewSession(token) {

    }

    /**
     * Completa los primeros pasos para un usuario.
     * @param {string} userId Identificador de usuario.
     * @param {string} nickname Apodo del usuario para asignar.
     */
    async function completeFirstStep(userId, nickname) {
        await database.query(`update usuario set primera_vez = 0, apodo = '${nickname}' where id_usuario = ${userId}`);
    }

    /**
     * Valida si el nombre de usuario es alfanumérico.
     * @param {string} username El nombre de usuario a verificar. 
     */
    function isValidUsername(username) {
        return username.match(/^[a-zA-Z1-9]+$/) != null;
    }

    /**
     * Convierte numero o strings en valores booleanos.
     * @param {number|string} n Numero bit o un estado en string a convertir.
     * @example 
     * parseBoolean('on')    // true
     * parseBoolean('off')   // false
     * parseBoolean(1)       // true
     * parseBoolean(0)       // false
     * parseBoolean('1')     // true
     * parseBoolean('0')     // false
     * parseBoolean('true')  // true
     * parseBoolean('false') // false
     */
    function parseBoolean(n) {
        if (typeof n === "string") {
            return n == '1' || n == 'true' || n == 'on' ? true : n == '0' || n == 'false' || n == 'off' ? false : null;
        }
        
        return n == 1 ? true : n == 0 ? false : null;
    }

    /**
     * Convierte una unidad ingresada a milisegundos.
     * @param {number} x El numero que se desea convertir.
     * @param {0|1|2|3} from La unidad del numero (Ej: minutos, segundos, horas).
     */
    function toMilliseconds(x, from) {
        const _x = {
            0: function() {
                return x * 1000;
            },
            1: function() {
                return this[0]() * 60;
            },
            2: function() {
                return this[1]() * 60;
            },
            3: function() {
                return this[2]() * 24;
            }
        }

        return _x[from]() ?? NaN;
    }
}

module.exports = initializeRoute;