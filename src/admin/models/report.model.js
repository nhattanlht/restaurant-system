// src/admin/models/report.model.js
const sql = require("mssql");
const dev_config = require('../../configs/mssql.config');

class ReportModel {
    static async getRevenueByBranch(year, month, day) {
        try {
            const pool = await sql.connect(dev_config);
            const query = `
                SELECT 
                    b.branch_id,
                    b.branch_name,
                    SUM(o.total_amount) AS total_revenue
                FROM 
                    [Order] o
                JOIN 
                    [Employee] e ON o.employee_id = e.employee_id
                JOIN 
                    [Department] d ON e.dept_id = d.department_id
                JOIN 
                    [Branch] b ON d.branch_id = b.branch_id
                WHERE
                    (@year IS NULL OR YEAR(o.order_date) = @year) AND
                    (@month IS NULL OR MONTH(o.order_date) = @month) AND
                    (@day IS NULL OR DAY(o.order_date) = @day)
                GROUP BY 
                    b.branch_id, b.branch_name;
            `;
            // Tạo request với các tham số động
            const request = pool.request();
            request.input('year', sql.Int, year || null);
            request.input('month', sql.Int, month || null);
            request.input('day', sql.Int, day || null);

            // Thực hiện truy vấn
            const result = await request.query(query);
            return result.recordset; // Trả về danh sách doanh thu theo chi nhánh
        } catch (error) {
            console.error('Error fetching revenue by branch:', error);
            throw error;
        }
    }
}

module.exports = ReportModel;