'use strict'

const dev_config = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        port: process.env.DEV_DB_PORT,
        server: process.env.DEV_DB_SERVER,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        name: process.env.DEV_DB_NAME,
    }
}

module.exports = dev_config
