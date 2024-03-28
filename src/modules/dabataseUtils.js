const fs = require("fs");
const mysql = require("mysql");

const dbclient = require("../class/DBClient");

const client = new dbclient();

/**
 * @typedef {import("mysql").Connection} Connection
 */

/**
 * @type {Connection}
 */
var connection = null;

/**
 * @returns {Promise<Connection>}
 */
async function makeConnection() {
    await client.connect();
    return client;
}

/**
 * Formats value for SQL file entry.
 * @param {*} value Value to format.
 */
function formatValue(value) {
    switch(typeof value) {
        case "string":
            return `'${value}'`;
        case "number":
            return value;
        default:
            return 'unknown-var-type';
    }
}

/**
 * Reads a SQL file.
 * @param {string} path Path to read.
 * @param {{ [varname: string]: string }} vars Variables to replace in SQL file. 
 */
function readSQLFile(path, vars) {
    try {
        var data = fs.readFileSync(path).toString("utf-8").trim();

        Object.entries(vars).forEach(([ key, value ]) => {
            const regex = new RegExp(`@${key}@`, "g");
    
            data = data.replace(regex, formatValue(value) );
        });
    
        return data;
    }
    catch {
        throw new Error("Failed to read SQL file.");
    }
}

module.exports = {
    readSQLFile,
    makeConnection,
    client
}