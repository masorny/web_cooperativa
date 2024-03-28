const { promisify } = require("util");
const mysql = require("mysql");

class db_client {
    /**
     * @typedef {import("mysql").Connection} MySQLConnection
     */

    /**
     * Creates a new Instance of db_client.
     * @param {MySQLConnection} connection 
     */
    constructor(connection) {
        this.connection = connection;
    }
    
    async connect() {
        this.connection = mysql.createConnection({
            user: "root",
            password: "",
            database: "db_cooperativa",
            host: "localhost",
            port: 3306,
            multipleStatements: true
        });

        return await new Promise((res, rej) => {
            this.connection.connect(err => {
                if (!err) {
                    return res(this);
                }

                rej(this);
            });
        });
    }

    /**
     * @param {string} sqlSentence 
     */
    async query(sqlSentence) {
        /** @type {Promise<>} */
        const promise = await new Promise((resolve, reject) => {
            const query = this.connection.query(sqlSentence);

            const resultArray = [];
            
            query.on("result", (packet) => {
                resultArray.push(packet);
            });

            query.on("end", (fields) => {
                resolve(resultArray);
            });

            query.on("error", (err) => {
                reject(err);
            });
        });

        return promise;
    }
}

module.exports = db_client;