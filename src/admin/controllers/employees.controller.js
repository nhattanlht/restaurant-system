const EmployeeModel = require('../../user/models/employees.model')

class EmployeeController {
    static searchCustomer = async (req, res) => {
        try {
            const { criteria } = req.query;
            const customers = await EmployeeModel.searchCustomer(criteria);
            console.log('customers', customers)
            // Pass a flag to indicate if customers were found
            const message = customers.length === 0 ? "Find a customer" : null;
            res.render('admin/admin', {
                title: 'Admin Dashboard',
                branches: null,
                employees: null,
                revenueData: null,
                revenueItem: null,
                areas: null,
                managers: null,
                departments: null,
                customers,
                message,
                invoices: null,
                items: null,
                categories: null,
                foods: null,
            });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    };

    static updateCustomer = async (req, res) => {
        const customerId = req.params.customerId;
        const updatedData = req.body;

        try {
            await EmployeeModel.updateCustomer(customerId, updatedData);
            res.status(200).send({ message: 'Customer updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Failed to update customer' });
        }
    };

    static deleteCustomer = async (req, res) => {
        try {
            const { customerId } = req.params;
            await EmployeeModel.deleteCustomer(customerId);
            res.redirect('/admin');
        } catch (error) {
            res.status(500).send('Server Error');
        }
    };

    static async insertCustomer(req, res) {
        try {
            const { name, phone, email, identity, gender } = req.body;
            // Tạo thông tin khách hàng từ request
            const customers = {
                customer_id: null, // Default to null, or populate dynamically if available
                name: name || null,
                phone_number: phone || null,
                email: email || null,
                identity_card: identity || null,
                gender: gender || null,
                member_card_number: null, // Add missing fields with null as default
                card_type: null,
                accumulated_spending: null,
                created_at: null,
                support_employee_id: null,
            };
            const message = null;
            // Kiểm tra hoặc tạo khách hàng
            customers.customer_id = await EmployeeModel.insertCustomer(customers);

            // Kết quả
            res.render('admin/admin', {
                title: 'Admin Dashboard',
                branches: null,
                employees: null,
                revenueData: null,
                revenueItem: null,
                areas: null,
                foods: null,
                managers: null,
                departments: null,
                customers: [customers],
                message,
                invoices: null,
                items: null,
                categories: null,
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to insert customer', error });
        }
    }
}

module.exports = EmployeeController;