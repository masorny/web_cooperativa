const { Router } = require("express");
const path = require("path");

class RouterHandler {
    /**
     * @typedef {import("express").Express} Express
     * @typedef {import("./Database")} Database
     */

    /**
     * Creates a new instance of RouterHandler.
     * @param {Express} server The sevrer instance.
     * @param {Database} database The instance of Database.
     */
    constructor(server, database) {
        /**
         * Server instance.
         */
        this.server = server;

        /**
         * Server database.
         */
        this.database = database;

        /**
         * Routers imported.
         */
        this.routers = [];
    }

    /**
     * Loads a route.
     * - Must required a defined function called `initializeRouter`.
     * - Parameters are:
     *      - **router**: The router instance.
     *      - **database**: The database instance.
     *      - **server**: The server instance.
     * 
     * @param {string} routerPath The router file path to import.
     */
    loadRouter(routerPath) {
        try {
            const initializeRouter = require( path.resolve(routerPath) );;

            const routerInstance = Router();

            initializeRouter(routerInstance, this.database, this.server);

            this.server.use(routerInstance);
            this.routers.push(routerInstance);
        }
        catch(err) {
            throw new Error("Was unable to import the router file. Is correctly specified?");
        }

        return this;
    }
}

module.exports = RouterHandler;