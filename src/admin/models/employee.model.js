'use strict';
const connect = 'I:\\Source code\\Restaurant\\src\\configs\\mssql.config.js'

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
    static async getAllEmployees() {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request().query(`SELECT * FROM [Employee]`);
            // console.log(result)

            return result.recordset;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    static async addEmployee(employeeData) {
        const { name, DOB, gender, dept_id, address, phone_number, user_id } = employeeData;
        try {
            const pool = await sql.connect(require(connect));
            await pool.request()
                .input('name', sql.NVarChar, name)
                .input('DOB', sql.Date, DOB)
                .input('gender', sql.NVarChar, gender)
                .input('dept_id', sql.Int, dept_id)
                .input('address', sql.NVarChar, address)
                .input('phone_number', sql.NVarChar, phone_number)
                .input('user_id', sql.Int, user_id)
                .query(`
                    INSERT INTO ${TABLE_NAME} (name, DOB, gender, dept_id, address, phone_number, user_id)
                    VALUES (@name, @DOB, @gender, @dept_id, @address, @phone_number, @user_id)
                `);
        } catch (error) {
            console.error('Error adding employee:', error);
            throw error;
        }
    }
}

module.exports = EmployeeModel;