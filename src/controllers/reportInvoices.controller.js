const InvoiceModel = require('../models/invoice.model'); // Assuming you have an invoice model
const CategoryModel = require('../models/categories.model');  // Assuming the Category model is set up
const FoodModel = require('../models/items.model.js');
class InvoiceController {
    // Method to fetch and filter invoices by customer or month
    static async reportInvoices(req, res) {
        const { name, phone_number, year, month } = req.query;
        console.log("Kiểm tra từ client: ", req.query);
    
        try {
            // Đợi lần lượt từng giao tác
            const categories = await CategoryModel.getAllCategories(); // Đợi lấy tất cả các danh mục
            const foods = await FoodModel.getAllFoods(); // Đợi lấy tất cả các món ăn
    
            // Lấy thông tin hóa đơn theo bộ lọc
            const invoices = await InvoiceModel.getInvoices({ name, phone_number, year, month });
    
            // Nếu có lỗi xảy ra trong quá trình lấy dữ liệu thì thông báo
            if (!invoices) {
                throw new Error('No invoices found.');
            }
    
            const message = 'null'; // Có thể sử dụng một thông báo lỗi hoặc thông tin khác
    
            // Render trang báo cáo hóa đơn và truyền kết quả vào view
            res.render('employees', { 
                foods, 
                customers: [], 
                categories, 
                items: [], 
                invoices, 
                message, 
                activeSection: 'report-invoices',
            });
    
        } catch (error) {
            console.error("Error fetching invoices:", error);
            res.status(500).send("Error fetching invoices.");
        }
    }
}

module.exports = InvoiceController;
