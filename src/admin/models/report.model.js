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
                    [Branch] b ON e.branch_id = b.branch_id
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

    // Hàm lấy doanh thu theo món
    static async getRevenueByItem(year, month, day) {
        try {
            const pool = await sql.connect(dev_config);
            const query = `
                SELECT 
                    mi.item_id,
                    mi.item_name,
                    SUM(od.quantity * od.price) AS total_revenue
                FROM 
                    dbo.Order_Detail od
                JOIN 
                    dbo.Menu_Item mi ON od.item_id = mi.item_id
                JOIN 
                    dbo.[Order] o ON od.order_id = o.order_id
                WHERE 
                    (@year IS NULL OR YEAR(o.order_date) = @year) AND
                    (@month IS NULL OR MONTH(o.order_date) = @month) AND
                    (@day IS NULL OR DAY(o.order_date) = @day)
                GROUP BY 
                    mi.item_id, mi.item_name
                ORDER BY 
                    total_revenue DESC;
            `;

            // Tạo request với các tham số động
            const request = pool.request();
            request.input('year', sql.Int, year || null);  // Nếu year là null thì cho phép chọn tất cả năm
            request.input('month', sql.Int, month || null);  // Nếu month là null thì cho phép chọn tất cả tháng
            request.input('day', sql.Int, day || null);  // Nếu day là null thì cho phép chọn tất cả ngày

            // Thực hiện truy vấn
            const result = await request.query(query);
            return result.recordset;  // Trả về danh sách doanh thu theo món
        } catch (error) {
            console.error('Error fetching revenue data by item:', error);
            throw error;  // Ném lỗi để Controller có thể xử lý
        }
    }
    static async getServiceReviewsByBranch() {
        try {
            await sql.connect(dev_config);
            const request = new sql.Request();
            const result = await request.query(`
                SELECT 
                    b.branch_id,
                    b.branch_name,
                    AVG(sr.service_rating) AS avg_service_rating,
                    AVG(sr.location_rating) AS avg_location_rating,
                    AVG(sr.food_quality_rating) AS avg_food_quality_rating,
                    AVG(sr.price_rating) AS avg_price_rating,
                    AVG(sr.ambiance_rating) AS avg_ambiance_rating,
                    COUNT(sr.review_id) AS total_reviews
                FROM 
                    Service_Review sr
                JOIN 
                    [Order] o ON sr.order_id = o.order_id
                JOIN 
                    Employee e ON o.employee_id = e.employee_id
                JOIN 
                    Branch b ON e.branch_id = b.branch_id
                GROUP BY 
                    b.branch_id, b.branch_name
            `);
            return result.recordset;
        } catch (error) {
            console.error('Error fetching service reviews by branch:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
}


module.exports = ReportModel;