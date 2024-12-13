'use strict';
const connect = '../../configs/mssql.config'

'use strict'

const sql = require('mssql')
const TABLE_NAME = 'Employee'

class EmployeeModel {
    constructor(pool) {
        this.pool = pool; // Kết nối SQL
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
    static async getEmployeeById(employee_id){
        try {
          const pool = await sql.connect(require(connect));
          const result = await pool.request()
              .input('employee_id', sql.Int, employee_id) // Thêm input cho employee_id
              .query('SELECT * FROM Employee WHERE employee_id = @employee_id');
      
          return result.recordset[0]; // Trả về nhân viên đầu tiên (nếu có)
        } catch (err) {
          console.error('Error fetching employee by ID:', err);
          throw err;
        }
      };
      
      // Thêm mới nhân viên
      static async addEmployee({employee_id, name, DOB, gender, dept_id, address, phone_number, user_id, branch_id }){
        try {
          const pool = await sql.connect(require(connect));
          const result = await pool.request()
              .input('employee_id', sql.Int, employee_id)
              .input('name', sql.NVarChar, name)
              .input('DOB', sql.Date, DOB)
              .input('gender', sql.Char, gender)
              .input('dept_id', sql.Int, dept_id)
              .input('address', sql.NVarChar, address)
              .input('phone_number', sql.NVarChar, phone_number)
              .input('user_id', sql.Int, user_id)
              .input('branch_id', sql.Int, branch_id)
              .query(`
              INSERT INTO Employee (employee_id, name, DOB, gender, dept_id, address, phone_number, user_id, branch_id) 
              VALUES (@employee_id ,@name, @DOB, @gender, @dept_id, @address, @phone_number, @user_id, @branch_id)
            `);
      
          return result.rowsAffected > 0; // Trả về true nếu thêm thành công
        } catch (err) {
          console.error('Error adding employee:', err);
          throw err;
        }
      };
      
      static async editEmployee(employee_id, updates){
        const { name, DOB, gender, dept_id, address, phone_number, user_id } = updates;
        try {
          const pool = await sql.connect(require(connect));
          await pool.request()
              .input('employee_id', sql.Int, employee_id)
              .input('name', sql.NVarChar, name)
              .input('DOB', sql.Date, DOB)
              .input('gender', sql.Char, gender)
              .input('dept_id', sql.Int, dept_id)
              .input('address', sql.NVarChar, address)
              .input('phone_number', sql.NVarChar, phone_number)
              .input('user_id', sql.Int, user_id)
              .query(`
                    UPDATE Employee 
                    SET name = @name, 
                        DOB = @DOB, 
                        gender = @gender, 
                        dept_id = @dept_id, 
                        address = @address, 
                        phone_number = @phone_number, 
                        user_id = @user_id 
                    WHERE employee_id = @employee_id
                `);
          return true; // Trả về true nếu cập nhật thành công
        } catch (err) {
          console.error('Error updating employee:', err);
          throw err; // Ném lỗi để xử lý ở nơi khác nếu cần
        }
      };

    // Xóa nhân viên
    static async deleteEmployee(employee_id) {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request()
                .input('employee_id', sql.Int, employee_id) // Thêm input cho employee_id
                .query('DELETE FROM Employee WHERE employee_id = @employee_id');

            // Kiểm tra xem có dòng nào bị xóa hay không
            return result.rowsAffected > 0; // Trả về true nếu xóa thành công
        } catch (err) {
            console.error('Error deleting employee:', err);
            throw err; // Ném lỗi để xử lý ở nơi khác nếu cần
        }
    };
    static async updateSalary(departmentName, newSalary) {
        const pool = await sql.connect(require(connect));
        const result = await pool
            .request()
            .input('departmentName', sql.NVarChar(100), departmentName)
            .input('newSalary', sql.Money, newSalary)
            .query(`
                UPDATE Department
                SET salary = @newSalary
                WHERE department_name = @departmentName
            `);
        return result;
    };
    static async transferEmployee(employeeId, newBranchId) {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool
                .request()
                .input('employee_id', employeeId)
                .input('new_branch_id', newBranchId)
                .execute('SP_TransferEmployee'); // Gọi stored procedure
            return { success: true, message: 'Employee transferred successfully.' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    static async getAllDepartment() {
        const pool = await sql.connect(require(connect));
        const result = await pool.request().query('SELECT * FROM Department');
        return result.recordset;
    }
}

module.exports = EmployeeModel;