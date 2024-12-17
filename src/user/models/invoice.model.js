const sql = require('mssql');
const config = require('../../configs/mssql.config');

class InvoiceModel {
    static async getInvoices({ name, phone_number, year, month }) {
        try {
            await sql.connect(config);
            const request = new sql.Request();
    
            let query = `
                SELECT O.order_id, O.order_date, O.amount, O.total_amount, O.payment_method, C.name, C.phone_number, C.email
                FROM [Order] O
                JOIN [Customer] C ON O.customer_id = C.customer_id
                WHERE 1 = 1
            `;
    
            // Adding dynamic filters
            if (name) {
                query += ` AND C.name LIKE N'%${name}%'`;
            }
            if (phone_number) {
                query += ` AND C.phone_number LIKE '%${phone_number}%'`;
            }
    
            // Filter by year
            if (year) {
                query += ` AND YEAR(O.order_date) = ${year}`;
            }
    
            // Filter by year and month, only if month is specified
            if (month && month !== 'all') {
                query += ` AND MONTH(O.order_date) = ${month}`;
            }
    
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }
}    
module.exports = InvoiceModel;
