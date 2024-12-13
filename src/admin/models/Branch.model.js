'use strict';

const sql = require('mssql');
const TABLE_NAME = 'Branch';
const connect = '../../configs/mssql.config'

class BranchModel {
    static async getAllBranches() {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request().query(`SELECT * FROM ${TABLE_NAME}`);
            return result.recordset;
        } catch (error) {
            console.error('Error fetching branches:', error);
            throw error;
        }
    }
    static async getBranchById(branch_id) {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request()
                .input('branch_id', sql.Int, branch_id)
                .query('SELECT * FROM Branch WHERE branch_id = @branch_id');

            return result.recordset[0]; // Trả về chi nhánh đầu tiên (nếu có)
        } catch (err) {
            console.error('Error fetching branch by ID:', err);
            throw err;
        }
    };


    static async addBranch(branchData) {
        const { branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager } = branchData;
        try {

            // Chuyển đổi chuỗi thành thời gian (giả sử định dạng là HH:mm:ss)
            const parseTime = (timeString) => {
                // Kiểm tra xem chuỗi có đúng định dạng không (HH:mm:ss)
                const timeParts = timeString.split(':');
                if (timeParts.length !== 3) {
                    throw new Error(`Invalid time format for: ${timeString}`);
                }
                // Đảm bảo rằng các phần của thời gian là số hợp lệ
                const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));
                if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
                    throw new Error(`Invalid time value for: ${timeString}`);
                }
                // Trả về đối tượng Date với thời gian xác định
                const now = new Date();
                now.setHours(hours, minutes, seconds, 0);
                return now;
            };

            // Chuyển đổi opening_time và closing_time thành Date objects
            const openingTime = parseTime(opening_time);
            const closingTime = parseTime(closing_time);

            const pool = await sql.connect(require(connect));;
            const result = await pool.request()
                .input('branch_name', sql.NVarChar, branch_name)
                .input('address', sql.NVarChar, address)
                .input('opening_time', sql.Time, openingTime)
                .input('closing_time', sql.Time, closingTime)
                .input('status', sql.NVarChar, status)
                .input('phone_number', sql.NVarChar, phone_number)
                .input('has_motorbike_parking', sql.Bit, has_motorbike_parking)
                .input('has_car_parking', sql.Bit, has_car_parking)
                .input('area_id', sql.Int, area_id)
                .input('manager', sql.Int, manager)
                .query(`
              INSERT INTO Branch (branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager)
              VALUES (@branch_name, @address, @opening_time, @closing_time, @status, @phone_number, @has_motorbike_parking, @has_car_parking, @area_id, @manager)
            `);
            return result.rowsAffected > 0;
        } catch (err) {
            console.error('Error adding branch:', err);
            throw err;
        }
    };

    // Cập nhật thông tin chi nhánh
    static async updateBranch(branch_id, branchData) {
        const { branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager } = branchData;
        try {
            // Chuyển đổi chuỗi thành thời gian (giả sử định dạng là HH:mm:ss)
            const parseTime = (timeString) => {
                // Kiểm tra xem chuỗi có đúng định dạng không (HH:mm:ss)
                const timeParts = timeString.split(':');
                if (timeParts.length !== 3) {
                    throw new Error(`Invalid time format for: ${timeString}`);
                }
                // Đảm bảo rằng các phần của thời gian là số hợp lệ
                const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));
                if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
                    throw new Error(`Invalid time value for: ${timeString}`);
                }
                // Trả về đối tượng Date với thời gian xác định
                const now = new Date();
                now.setHours(hours, minutes, seconds, 0);
                return now;
            };

            // Chuyển đổi opening_time và closing_time thành Date objects
            const openingTime1 = parseTime(opening_time);
            const closingTime1 = parseTime(closing_time);

            const pool = await sql.connect(require(connect));
            await pool.request()
                .input('branch_id', sql.Int, branch_id)
                .input('branch_name', sql.NVarChar, branch_name)
                .input('address', sql.NVarChar, address)
                .input('opening_time', sql.Time, openingTime1)
                .input('closing_time', sql.Time, closingTime1)
                .input('status', sql.NVarChar, status)
                .input('phone_number', sql.NVarChar, phone_number)
                .input('has_motorbike_parking', sql.Bit, has_motorbike_parking)
                .input('has_car_parking', sql.Bit, has_car_parking)
                .input('area_id', sql.Int, area_id)
                .input('manager', sql.Int, manager)
                .query(`
                UPDATE Branch 
                SET branch_name = @branch_name, 
                    address = @address, 
                    opening_time = @opening_time, 
                    closing_time = @closing_time, 
                    status = @status, 
                    phone_number = @phone_number, 
                    has_motorbike_parking = @has_motorbike_parking, 
                    has_car_parking = @has_car_parking, 
                    area_id = @area_id, 
                    manager = @manager 
                WHERE branch_id = @branch_id
            `);
            return true;
        } catch (err) {
            console.error('Error updating branch:', err);
            throw err;
        }
    };
    // Xóa chi nhánh
    static async deleteBranch(branch_id) {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request()
                .input('branch_id', sql.Int, branch_id)
                .query('DELETE FROM Branch WHERE branch_id = @branch_id');
            return result.rowsAffected > 0;
        } catch (err) {
            console.error('Error deleting branch:', err);
            throw err;
        }
    };

    static async getAllAreas() {
        const pool = await sql.connect(require(connect));
        const result = await pool.request().query('SELECT area_id, area_name FROM Area')
        return result.recordset;
    }

    static async getAllManagers() {
        const pool = await sql.connect(require(connect));
        const result = await pool.request().query('SELECT employee_id, name FROM Employee');
        return result.recordset;
    }
}

module.exports = BranchModel;