const InvoiceModel = require('../../user/models/invoice.model'); // Assuming you have an invoice model

class InvoiceController {
    // Method to fetch and filter invoices by customer or month
    static async reportInvoices(req, res) {
        const { name, phone_number, year, month } = req.query;
        console.log("Kiểm tra từ client: ", req.query);

        try {
            // Get filtered invoices from the model
            const invoices = await InvoiceModel.getInvoices({ name, phone_number, year, month });

            // Render the report invoices page and pass the results
            res.render('admin/admin', {
                title: 'Report Invoices',
                branches: null,
                employees: null,
                revenueData: null,
                revenueItem: null,
                areas: null,
                managers: null,
                departments: null,
                customers: null,
                categories: null,
                foods:null,
                items: null,
                invoices,
                message: null,
            });
        } catch (error) {
            console.error("Error fetching invoices:", error);
            res.status(500).send("Error fetching invoices.");
        }
    }
}

module.exports = InvoiceController;
