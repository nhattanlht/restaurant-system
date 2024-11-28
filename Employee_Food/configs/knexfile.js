// require("dotenv").config();
const fs = require('fs');
const path = require('path');
const sslCert = fs.readFileSync(path.join(__dirname, "ca.pem"))
const config = {
  development: {
    client: "pg", // Ensure the 'client' is specified as 'pg' for PostgreSQL
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: false,
        ca: sslCert,
      },
    },

    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  production: {
    client: "pg", // Same for production
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,

    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

module.exports = config[process.env.NODE_ENV || "development"];
