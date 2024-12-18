const ItemModel = require('../../user/models/itemEmployee.model');  // Assuming the Item model is set up for menu_item
const CategoryModel = require('../../user/models/categories.model');  // Assuming the Category model is set up

class ItemController {
    static async updateItem(req, res) {
        const { itemId } = req.params;  // Lấy itemId từ URL
        const { item_name, price, status } = req.body;  // Lấy các dữ liệu từ body request

        try {
            if (!itemId || !item_name || !price || !status) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Gọi hàm cập nhật món ăn
            const success = await ItemModel.updateItem(itemId, item_name, price, status);

            if (success) {
                return res.status(200).json({ message: 'Item updated successfully' });
            } else {
                return res.status(400).json({ message: 'Cannot update item' });
            }
        } catch (error) {
            console.error('Error updating item:', error);
            return res.status(500).json({ message: 'Error updating item' });
        }
    }

    static async deleteItem(req, res) {
        const { itemId } = req.params;

        try {
            const success = await ItemModel.deleteItem(itemId);
            if (success) {
                res.status(200).json({ message: 'Item deleted successfully' });
            } else {
                res.status(400).json({ message: 'Failed to delete item' });
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ message: 'Error deleting item' });
        }
    };


    // Thêm món ăn mới
    static async addItem(req, res) {
        const { item_name, category_id, price } = req.body;
        try {
            const newItem = await ItemModel.addItem(item_name, category_id, price);
            if (newItem) {
                res.status(200).json({ message: 'Item added successfully' });
            } else {
                res.status(400).json({ message: 'Failed to add item' });
            }
        } catch (error) {
            console.error('Error adding item:', error);
            res.status(500).json({ message: 'Error adding item' });
        }
    }
    // Get all items and render the 'items' view
    static async getAllItems(req, res) {
        try {
            // Fetch all items from the database using the ItemModel
            const items = await ItemModel.getAllItems();
            const categories = await CategoryModel.getAllCategories();
            // Render the 'employees' page and pass the items to be displayed
            res.render('admin/admin', {
                title: 'Item Management',
                branches: null,
                employees: null,
                revenueData: null,
                revenueItem: null,
                areas: null,
                managers: null,
                departments: null,
                invoices: null,
                customers: null,
                items,
                categories,
                message: null,
                foods: null,
            });
        } catch (error) {
            console.error("Error fetching all items:", error);
            res.status(500).send("Error fetching all items.");
        }
    }

    // Phương thức tìm kiếm món ăn
    static async searchItems(req, res) {
        const { itemName, categoryId, maxPrice } = req.query;
        console.log("Ktra", req.query);

        try {

            const categories = await CategoryModel.getAllCategories();
            const message = 'null';
            // Xây dựng truy vấn tìm kiếm
            let query = `
            SELECT M.*, C.category_name
            FROM Menu_Item M
            JOIN Category C ON M.category_id = C.category_id
            WHERE M.status = 'Available'
        `;

            if (itemName) {
                query += ` AND M.item_name LIKE N'%${itemName}%'`;
            }
            if (categoryId && categoryId !== 'all') {
                query += ` AND M.category_id = ${categoryId}`;
            }
            if (maxPrice) {
                query += ` AND M.price <= ${maxPrice}`;
            }
            // Thực hiện truy vấn và lấy kết quả
            const items = await ItemModel.searchItems(query);

            // Render lại trang 'employees' với kết quả tìm kiếm và danh mục
            res.render('admin/admin', {
                title: 'Item Management',
                branches: null,
                employees: null,
                revenueData: null,
                revenueItem: null,
                areas: null,
                managers: null,
                departments: null,
                message,
                foods: null,
                customers: null,
                invoices: null,  // Dữ liệu khách hàng nếu cần
                items,  // Món ăn tìm được
                categories,  // Các danh mục
                itemName,  // Tên món ăn tìm kiếm
                categoryId,  // Danh mục đã chọn
                maxPrice  // Giá tối thiểu đã chọn
            });
        } catch (error) {
            console.error("Error searching items:", error);
            res.status(500).send("Error searching items.");
        }
    }
}

module.exports = ItemController;
