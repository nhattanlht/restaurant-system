'use strict'

const sql = require('mssql')
const TABLE_NAME = 'Employee'

class EmployeeModel{
    constructor(pool) {
        this.pool = pool; // Kết nối SQL
    }
    static async insertEmployee(employeeData, transaction) {
        try {
            const request = transaction.request();

            // Thêm các tham số vào request
            request.input('employee_id', sql.Int, employeeData.employee_id)
            request.input('name', sql.NVarChar, employeeData.name)
            request.input('dept_id', sql.Int, 1)
            request.input('user_id', sql.Int, employeeData.user_id)

            // Gọi stored procedure
            const result  = await request.execute('SP_InsertNewEmployee');

            return result.recordset[0];
        } catch (error) {
            console.error('Inserted error:', error);
        }
    }

    static async findEmployeeById(employee_id, transaction) {
        const request = transaction.request();
        request.input('employee_id', sql.Int, employee_id)

        const result =  await request.execute('SP_FindEmployeeById')
        return result.recordset[0];

    }

}

module.exports = EmployeeModel;