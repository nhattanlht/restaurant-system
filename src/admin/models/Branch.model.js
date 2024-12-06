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

    static async addBranch(branchData) {
        const { branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager } = branchData;
        try {
            const pool = await sql.connect(require(connect));
            await pool.request()
                .input('branch_name', sql.NVarChar, branch_name)
                .input('address', sql.NVarChar, address)
                .input('opening_time', sql.Time, opening_time)
                .input('closing_time', sql.Time, closing_time)
                .input('status', sql.NVarChar, status)
                .input('phone_number', sql.NVarChar, phone_number)
                .input('has_motorbike_parking', sql.Bit, has_motorbike_parking)
                .input('has_car_parking', sql.Bit, has_car_parking)
                .input('area_id', sql.Int, area_id)
                .input('manager', sql.Int, manager)
                .query(`
                    INSERT INTO ${TABLE_NAME} (branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager)
                    VALUES (@branch_name, @address, @opening_time, @closing_time, @status, @phone_number, @has_motorbike_parking, @has_car_parking, @area_id, @manager)
                `);
        } catch (error) {
            console.error('Error adding branch:', error);
            throw error;
        }
    }
}

module.exports = BranchModel;