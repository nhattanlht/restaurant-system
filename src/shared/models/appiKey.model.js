'use strict';

const sql = require('mssql');
const TABLE_NAME = 'Apikey';

class ApiKeyModel {
    constructor(pool) {
        this.pool = pool;
    }

    static async insertApiKey(apiKeyData) {
        try {
            const { key, status, permission } = apiKeyData;
            const request = this.pool.request();
            await request
                .input('key', sql.NVarChar, key)
                .input('status', sql.NVarChar, status)
                .input('permission', sql.NVarChar, permission)
                .query(`
                    INSERT INTO ${TABLE_NAME} (key, status, permission)
                    VALUES (@key, @status, @permission)
                `);
            console.log("API key inserted successfully");
        } catch (error) {
            console.error("Error inserting API key:", error);
        }
    }

    static async getApiKey(key) {
        try {
            const request = this.pool.request();
            const result = await request
                .input('key', sql.NVarChar, key)
                .query(`SELECT * FROM ${TABLE_NAME} WHERE key = @key`);
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    }
}

module.exports = ApiKeyModel;
