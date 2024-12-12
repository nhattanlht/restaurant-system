const EmployeeModel = require('../models/employee.model')

class EmployeeController{
    static RenderEmployeeDashboard(req, res) {
        res.render('employee');
    }
}

module.exports = EmployeeController;