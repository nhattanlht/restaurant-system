const sql = require('mssql');
const {db: {server, port, name, user, password}} = require('../configs/mssql.config');

const connectString = `Server=tcp:${server}, ${port};Initial Catalog=${name};Persist Security Info=False;User ID=${user};Password=${password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`

// Design pattern: Singleton
class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            await sql.connect(connectString);
            console.log('Connected to MSSQL successfully');
        } catch (err) {
            console.log('Error connecting to database:', err);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMSSQL = Database.getInstance();
module.exports = instanceMSSQL;
