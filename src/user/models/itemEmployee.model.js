const sql = require('mssql');
const config = require('../../configs/mssql.config'); // Import database connection
class ItemModel {

     //update Items
     static async updateItem(itemId, item_name, price, status) {
        try {
            await sql.connect(config);
            const request = new sql.Request();

            console.log('Running query to update item with ID:', itemId);  // Log truy vấn đang thực thi

            // Cập nhật món ăn
            request.input('itemId', sql.Int, itemId);
            request.input('item_name', sql.NVarChar, item_name);
            request.input('price', sql.Money, price);
            request.input('status', sql.NVarChar, status);

            const result = await request.query(`
                UPDATE Menu_Item
                SET item_name = @item_name, price = @price, status = @status
                WHERE item_id = @itemId
            `);

            console.log('Query result:', result);  // Log kết quả truy vấn
            return result.rowsAffected > 0;
        } catch (error) {
            console.error('Error while updating item:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }
    //delete Items
    static async deleteItem(itemId) {
        try {
            await sql.connect(config);
            const request = new sql.Request();

            request.input('item_id', sql.Int, itemId);

            const query = `
                DELETE FROM Menu_Item
                WHERE item_id = @item_id
            `;
            const result = await request.query(query);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error while deleting item:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }
    //Insert Item
    static async addItem(item_name, category_id, price) {
        try {
            await sql.connect(config);
    
            const request = new sql.Request();
    
            // Lấy giá trị item_id lớn nhất hiện tại từ bảng Menu_Item
            const result = await request.query(`
                SELECT MAX(item_id) AS max_item_id FROM Menu_Item
            `);
            const maxItemId = result.recordset[0].max_item_id || 0;  // Nếu không có dữ liệu, bắt đầu từ 0
    
            const newItemId = maxItemId + 1;  // Cộng thêm 1 để tạo item_id mới
    
            // Tiến hành insert dữ liệu với item_id tự động
            request.input('item_id', sql.Int, newItemId);
            request.input('item_name', sql.NVarChar, item_name);
            request.input('category_id', sql.Int, category_id);
            request.input('price', sql.Money, price);
            request.input('status', sql.NVarChar, 'Available');
    
            // Chèn dữ liệu vào bảng Menu_Item
            const insertResult = await request.query(`
                INSERT INTO Menu_Item (item_id, item_name, category_id, price, status)
                VALUES (@item_id, @item_name, @category_id, @price, @status)
            `);
    
            return insertResult.rowsAffected > 0;  // Trả về true nếu đã chèn thành công
        } catch (error) {
            console.error('Error while adding item:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }
    // Get All Item
    static async getAllItems() {
        try {
            await sql.connect(config);
            const request = new sql.Request();
            const query = `
            SELECT *
            FROM Menu_Item M
            JOIN Category C ON M.category_id = C.category_id
            WHERE M.status = 'Available';
        `;
            const result = await request.query(query);
            return result.recordset;  // Return the list of items
        } catch (error) {
            console.error('Error while fetching all items:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    };
    //Tìm kiếm món ăn
    static async searchItems(query) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error while searching items:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }

    // Other item methods for adding, updating, deleting items...
}

module.exports = ItemModel ;
