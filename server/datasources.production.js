const settings = require('../configs/database.json');

const env = 'production';
const host = process.env.DB_HOST || settings[process.env.NODE_ENV || env].host;
const user = process.env.DB_USER || settings[process.env.NODE_ENV || env].user;
const password = process.env.DB_PASSWORD || settings[process.env.NODE_ENV || env].password;
const database = process.env.DB_DATABASE || settings[process.env.NODE_ENV || env].database;

module.exports = {
    hts: {
        host,
        user,
        password,
        database,
        port: process.env.DB_PORT || settings[process.env.NODE_ENV || env].port,
        url: `mysql://${user}:${password}@${host}/${database}`,
        name: "hts",
        connector: "mysql"
    }
}