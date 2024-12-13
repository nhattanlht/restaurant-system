const EmployeeModel = require('../models/employees.model')

class EmployeeController {
    static searchCustomer = async (req, res) => {
        try {
            const { criteria } = req.query;
            const customers = await EmployeeModel.searchCustomer(criteria);
            res.render('employees', { customers });
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
}

module.exports = EmployeeController;