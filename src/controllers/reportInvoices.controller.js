const InvoiceModel = require('../models/invoice.model'); // Assuming you have an invoice model
const CategoryModel = require('../models/categories.model');  // Assuming the Category model is set up
class InvoiceController {
    // Method to fetch and filter invoices by customer or month
    static async reportInvoices(req, res) {
        const { name, phone_number, year, month} = req.query;
        console.log("Kiểm tra từ client: ", req.query);
        const categories=await CategoryModel.getAllCategories();

        try {
            // Get filtered invoices from the model
            const invoices = await InvoiceModel.getInvoices({ name, phone_number, year, month });
            const message = 'null';

            // Render the report invoices page and pass the results
            res.render('employees', { foods:[],customers: [], categories, items: [], invoices, message, activeSection: 'report-invoices', });
        } catch (error) {
            console.error("Error fetching invoices:", error);
            res.status(500).send("Error fetching invoices.");
        }
    }
}

module.exports = InvoiceController;
