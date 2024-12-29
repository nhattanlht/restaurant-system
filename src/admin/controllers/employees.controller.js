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
                phone: phone,
                email: email,
                identity_card: identity || null,
                gender: gender || null,
                member_card_number: null, // Add missing fields with null as default
                card_type: null,
                accumulated_spending: null,
                created_at: null,
                support_employee_id: null,
            };

            console.log('controller',phone);

            let message = null; // Biến để lưu thông báo thành công hoặc lỗi

            // Thực hiện thêm khách hàng
            customers.customer_id = await EmployeeModel.insertCustomer(customers);

            // Nếu thêm thành công, đặt thông báo thành công
            message = 'Khách hàng đã được thêm thành công!';

            // Render trang admin với thông tin cập nhật
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
                message, // Gửi thông báo thành công
                invoices: null,
                items: null,
                categories: null,
            });
        } catch (error) {
            // Xử lý lỗi cụ thể nếu gặp vấn đề (như trùng email, số điện thoại, hoặc lỗi khác)
            let message = 'Đã xảy ra lỗi trong quá trình thêm khách hàng. Vui lòng thử lại.';
            if (error.originalError) {
                const errorMessage = error.originalError.message;

                if (errorMessage.includes('Email already exists')) {
                    message = 'Lỗi: Email đã tồn tại trong hệ thống.';
                } else if (errorMessage.includes('Phone number already exists')) {
                    message = 'Lỗi: Số điện thoại đã tồn tại trong hệ thống.';
                }
            } else if (error.message.includes('The transaction ended in the trigger. The batch has been aborted.')) {
                message = 'Lỗi: Đã xảy ra sự cố trong quá trình thực thi trigger.';
            }
            // Render lại trang admin với thông báo lỗi
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
                customers: [],
                message, // Gửi thông báo lỗi
                invoices: null,
                items: null,
                categories: null,
            });

            console.error('Error in insertCustomer:', error);
        }
    }
}

module.exports = EmployeeController;