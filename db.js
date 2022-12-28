const { createPool } = require('mysql2/promise')
const db_config = require('./config/db-config')

const pool = new createPool({
    host: db_config.host,
    user: db_config.user,
    password: db_config.password,
    port: db_config.port,
    database: db_config.database
})

module.exports = { pool }