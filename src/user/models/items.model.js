'use strict'
const sql = require('mssql');
const config = require('../../configs/mssql.config');

class FoodModel {
    static async searchFoods(filters, transaction) {
        const { branch, category, price, search } = filters;

        const request = transaction.request();

        // Xây dựng truy vấn động với JOIN 3 bảng
        let query = `
        SELECT mi.item_id, mi.item_name, mi.price, c.category_name
        FROM BranchMenu bm
        JOIN Menu_Item mi ON bm.item_id = mi.item_id
        JOIN Category c ON mi.category_id = c.category_id
        WHERE 1 = 1
    `;

        // Nếu branch không phải 'all', thêm điều kiện
        if (branch !== 'all') {
            query += ` AND bm.branch_id = @branch_name`;
            request.input('branch_name', sql.Int, branch);
        }

        // Nếu category không phải 'all', thêm điều kiện
        if (category !== 'all') {
            query += ` AND mi.category_id = @category`;
            request.input('category', sql.Int, category);
        }

        // Nếu price có giá trị, thêm điều kiện
        if (price !== null) {
            query += ` AND mi.price <= @price`;
            request.input('price', sql.Money, price);
        }

        // Nếu có tìm kiếm, thêm điều kiện tìm kiếm theo tên món ăn
        if (search) {
            query += ` AND mi.item_name LIKE @search`;
            request.input('search', sql.NVarChar, `%${search}%`);
        }
        console.log(query)
        // Thực thi truy vấn
        try {
            const result = await request.query(query);
            return result.recordset; // Trả về kết quả
        } catch (err) {
            console.error('Error executing query', err);
            throw err;
        }
    }


    // static async  searchFoods(filters = {}) {
    //     try {
    //         await sql.connect(config);
    //         const request = new sql.Request();
    //
    //         // Chuẩn bị các điều kiện lọc động
    //         let whereConditions = [];
    //         if (filters.branch && filters.branch !== 'all') {
    //             request.input('branch', sql.NVarChar, filters.branch);
    //             whereConditions.push('bm.branch_id = @branch');
    //         }
    //         if (filters.category && filters.category !== 'all') {
    //             request.input('category', sql.NVarChar, filters.category);
    //             whereConditions.push('c.category_id = @category');
    //         }
    //         if (filters.price) {
    //             request.input('price', sql.Money, filters.price);
    //             whereConditions.push('mi.price <= @price');
    //         }
    //         if (filters.search && filters.search.trim() !== '') {
    //             request.input('search', sql.NVarChar, `%${filters.search}%`);
    //             whereConditions.push('mi.item_name LIKE @search');
    //         }
    //
    //         // Kết hợp điều kiện WHERE
    //         const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    //
    //         // Truy vấn kết hợp với các điều kiện
    //         const query = `
    //             SELECT
    //                 mi.item_id,
    //                 mi.item_name,
    //                 mi.price,
    //                 mi.status,
    //                 c.category_name,
    //                 bm.branch_id
    //             FROM BranchMenu bm
    //             JOIN Menu_Item mi ON bm.item_id = mi.item_id
    //             JOIN Category c ON mi.category_id = c.category_id
    //             ${whereClause}
    //         `;
    //
    //         // Thực hiện truy vấn
    //         const result = await request.query(query);
    //         return result.recordset;
    //     } catch (error) {
    //         console.error('Error while searching foods:', error);
    //         throw new Error(error.message);
    //     } finally {
    //         await sql.close();
    //     }
    // }
    static async getAllFoods() {
        try {
            await sql.connect(config);
            const request = new sql.Request();
            // Thực hiện truy vấn kết hợp
            const query = `
            SELECT *
            FROM Menu_item
             `;
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error while getting all foods:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }
    // Lấy tất cả thành phố
    static async getAreas() {
        try {
            await sql.connect(config);
            const result = await sql.query('SELECT area_id, area_name FROM Area');
            return result.recordset;
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
    // Lấy chi nhánh 
    static async getBranches() {
        try {
            await sql.connect(config);
            const result = await sql.query('SELECT branch_id, branch_name FROM Branch');
            return result.recordset;
        } catch (error) {
            console.error('Error fetching branches:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
    // Lấy loại món ăn
    static async getCategories() {
        try {
            await sql.connect(config);
            const result = await sql.query('SELECT category_id, category_name FROM category');
            return result.recordset;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
    // Lấy chi nhánh theo ID thành phố
    static async getBranchesByArea(areaid) {
        try {
            await sql.connect(config);
            const request = new sql.Request();
            request.input('areaid', sql.Int, areaid);

            const query = 'SELECT branch_id, branch_name FROM Branch WHERE area_id = @areaid';
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error fetching branches:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }

    //tìm kiếm thức ăn theo chi nhánh
    static async searchFoodsByBranch(branchName) {
        try {
            await sql.connect(config);
            const request = new sql.Request();
            request.input('branchid', sql.Int, branchName);

            // Thực hiện truy vấn kết hợp
            const query = `
            SELECT mi.*
            FROM BranchMenu b
            JOIN menu_item mi ON b.item_id = mi.item_id
            WHERE b.branch_id = @branchid
             `;
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Lỗi khi tìm món ăn theo chi nhánh:', error.message);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }
    // Lấy tất cả thành phố
    static async getAreas() {
        try {
            await sql.connect(config);
            const result = await sql.query('SELECT area_id, area_name FROM Area');
            return result.recordset;
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
    // Lấy chi nhánh theo ID thành phố
    static async getBranchesByCity(areaid) {
        try {
            await sql.connect(config);
            const request = new sql.Request();
            request.input('areaid', sql.Int, areaid);

            const query = 'SELECT branch_id, branch_name FROM Branch WHERE area_id = @areaid';
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error fetching branches:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }

}

module.exports = FoodModel;
