const sql = require('mssql');
const dev_config = require('../configs/mssql.config');

class Database {
    // Phương thức connect() để kết nối cơ sở dữ liệu
    async connect() {
        try {
            const pool = await sql.connect(dev_config);
            console.log('Connected to MSSQL successfully');
            return pool;  // Trả về kết nối mỗi lần cần
        } catch (err) {
            console.error('Error connecting to database:', err);
            throw new Error('Database connection failed');
        }
    }

    // Phương thức để lấy transaction
    async getTransaction() {
        try {
            const pool = await this.connect();  // Mở kết nối mỗi lần
            const transaction = new sql.Transaction(pool);  // Tạo transaction mới từ pool
            await transaction.begin();  // Ensure that the transaction is started here
            return transaction;  // Return the transaction after it is started
        } catch (error) {
            console.error('Error starting transaction:', error);
            throw error;  // Throw error if the transaction cannot be started
        }
    }

    // Phương thức thực hiện transaction (ví dụ: commit và rollback)
    async runTransaction(callback) {
        const transaction = await this.getTransaction();  // Get and start the transaction
        try {
            // Execute the callback (user will execute queries inside the callback)
            await callback(transaction);
            // Commit transaction if everything is successful
            await transaction.commit();
            console.log('Transaction committed successfully');
        } catch (err) {
            // If there's an error, rollback the transaction
            await transaction.rollback();
            console.error('Transaction rolled back due to error:', err);
            throw err;  // Rethrow the error after rollback
        }
    }
}

module.exports = Database;
