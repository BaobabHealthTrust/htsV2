const settings = require('../configs/database.json');

module.exports = {
    hts: {
        host: process.env.DB_HOST || settings[process.env.NODE_ENV || 'production'].host,
        user: process.env.DB_USER || settings[process.env.NODE_ENV || 'production'].user,
        password: process.env.DB_PASSWORD || settings[process.env.NODE_ENV || 'production'].password,
        database: process.env.DB_DATABASE || settings[process.env.NODE_ENV || 'production'].database,
        port: process.env.DB_PORT || settings[process.env.NODE_ENV || 'production'].port
    }
}