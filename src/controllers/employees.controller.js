const EmployeeModel = require('../models/employees.model')
const ItemModel = require('../models/itemEmployee.model');  // Assuming the Item model is set up for menu_item
const CategoryModel = require('../models/categories.model');  // Assuming the Category model is set up

class EmployeeController {
    static searchCustomer = async (req, res) => {
        try {
            const { criteria} = req.query;
            const customers = await EmployeeModel.searchCustomer(criteria);
            const items = await ItemModel.getAllItems();
            const categories = await CategoryModel.getAllCategories();
            // Pass a flag to indicate if customers were found
            const message = customers.length === 0 ? "Find a customer" : null;
            // Add the active section flag
            res.render('employees', {
                customers,
                message,
                invoices: [],
                items,
                categories,
                activeSection: 'customer-management' // Set the active section
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
            res.redirect('/employees');
        } catch (error) {
            res.status(500).send('Server Error');
        }
    };

    static async insertCustomer(req, res) {
        try {
            const { name, phone, email, identity, gender,activeSection  } = req.body;
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
            const items = await ItemModel.getAllItems();
            const categories = await CategoryModel.getAllCategories();

            // Kết quả
            res.render('employees', { customers: [customers], message, invoices: [], items, categories,activeSection: 'customer-management'  });
        } catch (error) {
            res.status(500).json({ message: 'Failed to insert customer', error });
        }
    }
}

module.exports = EmployeeController;