'use strict'

const fs = require('fs');
const path = require('path');
const sql = require('mssql');
const config = require('../configs/mssql.config');

class FoodModel {
    static async searchFoods(filters = {}) {
        try {
            const filePath = path.join(__dirname, '../../branch_menu_data.json');
            const data = fs.readFileSync(filePath, 'utf-8');

            if (!data) {
                throw new Error('No data found in JSON file');
            }

            const branchData = JSON.parse(data);

            // Lọc chi nhánh trước
            let filteredBranches = branchData.branches.filter(branch => {
                // Lọc theo branch nếu không phải 'all'
                return filters.branch === 'all' || branch.branch_name === filters.branch;
            });

            let filteredFoods = [];

            // Lọc theo menu_items trong từng branch đã lọc
            filteredBranches.forEach(branch => {
                let branchFoods = branch.menu_items.filter(item => {
                    // Lọc theo phân loại món ăn nếu không phải 'all'
                    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
                        return false;
                    }

                    // Lọc theo giá tiền nếu có chỉ định
                    if (filters.price && parseInt(item.price) > filters.price) {
                        return false;
                    }

                    // Lọc theo từ khóa tìm kiếm nếu có chỉ định
                    if (filters.search && !item.item_name.toLowerCase().includes(filters.search.toLowerCase())) {
                        return false;
                    }

                    return true; // Giữ lại món ăn phù hợp
                });

                // Gắn thông tin chi nhánh vào từng món ăn và thêm vào danh sách kết quả
                branchFoods.forEach(item => {
                    filteredFoods.push({
                        branch: branch.branch_name,
                        ...item
                    });
                });
            });


            return filteredFoods;
        } catch (error) {
            console.error('Error while searching foods:', error);
            throw new Error(error.message);
        }
    }
    static async getAllFoods() {
        try {
            const filePath = path.join(__dirname, '../../branch_menu_data.json'); // Đảm bảo đường dẫn đúng
            const data = fs.readFileSync(filePath, 'utf-8');

            if (!data) {
                throw new Error('No data found in JSON file');
            }

            const branchData = JSON.parse(data);
            let allFoods = [];

            // Duyệt qua tất cả chi nhánh và lấy tất cả món ăn
            branchData.branches.forEach(branch => {
                branch.menu_items.forEach(item => {
                    allFoods.push({
                        branch: branch.branch_name,
                        ...item
                    });
                });
            });

            // Trả về tất cả món ăn
            return allFoods;
        } catch (error) {
            console.error('Error while getting all foods:', error);
            throw new Error(error.message);
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
            const filePath = path.join(__dirname, '../../branch_menu_data.json'); // Đường dẫn file JSON
            const data = fs.readFileSync(filePath, 'utf-8');
    
            if (!data) {
                throw new Error('Không tìm thấy dữ liệu trong file JSON');
            }
    
            const branchData = JSON.parse(data);
    
            // Tìm chi nhánh theo tên
            const branch = branchData.branches.find(branch => branch.branch_name.toLowerCase() === branchName.toLowerCase());
            console.log('Chi nhánh đang tìm kiếm:', branchName); 
            if (!branch) {
                throw new Error(`Không tìm thấy chi nhánh "${branchName}"`);
            }
    
            // Lấy tất cả món ăn của chi nhánh
            const filteredFoods = branch.menu_items.map(item => ({
                branch: branch.branch_name,
                ...item
            }));
    
            return filteredFoods;
        } catch (error) {
            console.error('Lỗi khi tìm món ăn theo chi nhánh:', error.message);
            throw new Error(error.message);
        }
    }
    
    //Kiểm tra khách hàng đã tồn tại hay chưa
    static async checkOrCreateCustomer(infocustomer = {}) {
        try {
            const { name, phone, email, identity, gender } = infocustomer;
    
            await sql.connect(config);
    
            // Kiểm tra email trong bảng Customer
            const emailCheckQuery = `SELECT customer_id FROM Customer WHERE email = @Email`;
            const result = await sql.query({
                text: emailCheckQuery,
                input: { Email: email }
            });
    
            if (result.recordset && result.recordset.length > 0) {
                // Email đã tồn tại, trả về customer_id
                return result.recordset[0].customer_id;
            } else {
                // Email chưa tồn tại, tạo customer_id mới
                const maxIdQuery = `SELECT ISNULL(MAX(customer_id), 0) + 1 AS new_customer_id FROM Customer`;
                const maxIdResult = await sql.query(maxIdQuery);
                const newCustomerId = maxIdResult.recordset[0].new_customer_id;
    
                // Thêm thông tin khách hàng mới với customer_id
                const insertQuery = `
                    INSERT INTO Customer (customer_id, name, phone_number, email, identity_card, gender)
                    VALUES (@CustomerId, @Name, @Phone, @Email, @Identity, @Gender)
                `;
                await sql.query({
                    text: insertQuery,
                    input: {
                        CustomerId: newCustomerId,
                        Name: name || null,
                        Phone: phone || null,
                        Email: email,
                        Identity: identity || null,
                        Gender: gender || null
                    }
                });

                console.log('User inserted successfully')
    
                return newCustomerId; // Trả về customer_id vừa tạo
            }
        } catch (error) {
            console.error('Error in checkOrCreateCustomer:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
    
}

module.exports = FoodModel;
