const settings = require('../configs/database.json');
module.exports = {
    hts: {
        host: process.env.DB_HOST || settings[process.env.NODE_ENV || 'development'].host,
        user: process.env.DB_USER || settings[process.env.NODE_ENV || 'development'].user,
        password: process.env.DB_PASSWORD || settings[process.env.NODE_ENV || 'development'].password,
        database: process.env.DB_DATABASE || settings[process.env.NODE_ENV || 'development'].database,
        connector: "mysql",
        port: process.env.DB_PORT || settings[process.env.NODE_ENV || 'development'].port,
        url: `mysql://${process.env.DB_USER || settings[process.env.NODE_ENV || 'development'].user}:${process.env.DB_PASSWORD || settings[process.env.NODE_ENV || 'development'].password}@${process.env.DB_HOST || settings[process.env.NODE_ENV || 'development'].host}/${process.env.DB_DATABASE || settings[process.env.NODE_ENV || 'development'].database}`,
        name: 'hts'
    }
}