const sql = require('mssql');
const dev_config = require('../configs/mssql.config');
// Design pattern: Singleton
class Database {
    constructor() {
        this.poolPromise = this.connect();  // Initialize connection and store the promise
    }

    // Async connection method that establishes the connection and returns the pool
    async connect() {
        try {
            const pool = await sql.connect(dev_config);
            this.pool = pool;  // Store the pool
            console.log('Connected to MSSQL successfully');
            return pool;  // Return the pool to ensure it's available for use
        } catch (err) {
            console.log('Error connecting to database:', err);
            throw new Error('Database connection failed');
        }
    }

    // Instance method to get the pool after ensuring it's initialized
    async getPool() {
        if (!this.pool) {
            // Wait for the connection to be established if not done yet
            await this.poolPromise;
        }
        return this.pool;  // Return the pool after it's guaranteed to be initialized
    }

    // Singleton pattern: Ensure only one instance of Database exists
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async getTransaction() {
        try {
            const pool = await this.getPool(); // Ensure the pool is initialized
            const transaction = new sql.Transaction(pool); // Create a new transaction
            await transaction.begin(); // Begin the transaction
            console.log('Transaction started');
            return transaction; // Return the transaction instance for further use
        } catch (err) {
            console.error('Error starting transaction:', err);
            throw new Error('Failed to create transaction');
        }
    }
    async close() {
        if (this.pool) {
            await this.pool.close();
            console.log('Database connection closed');
        }
    }

}

const instanceMSSQL = Database.getInstance();
module.exports = instanceMSSQL;