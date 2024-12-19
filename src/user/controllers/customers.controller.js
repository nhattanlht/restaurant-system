const FoodModel = require('../models/items.model.js');
const BooktableModel = require('../models/booktable.model.js');

class CustomersController {
    static async getFoods(req, res) {
        try {
            const { branch, category, price, search } = req.query;
            console.log("Received filters:", req.query);

            let filters = {
                branch: branch || 'all', //nhận từ client
                category: category || 'all',
                price: price ? parseInt(price) : null,
                search: search || ''

            };
            let foods = await FoodModel.searchFoods(filters);
            res.render('user/customers', { foods, filters });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching food data', error });
        }
    }

    static async renderFoods(req, res) {
        try {
            console.log(req.session.user)
            // Lấy tất cả món ăn từ model
            let foods = await FoodModel.getAllFoods(); // Gọi hàm getAllFoods trong model

            // Render trang với tất cả món ăn và các bộ lọc (filters)
            res.render('user/customers', { foods, filters: {} });
        } catch (error) {
            // Nếu có lỗi, trả về mã lỗi 500 với thông báo lỗi
            res.status(500).json({ message: 'Lỗi khi lấy dữ liệu món ăn', error });
        }
    }

    // Lấy danh sách khu vực
    static async getAllAreas(req, res) {
        try {
            const areas = await FoodModel.getAreas();
            res.json(areas);  // Trả về danh sách khu vực
        } catch (error) {
            console.error('Error fetching areas:', error);
            res.status(500).send('Server Error');
        }
    }

    // Lấy chi nhánh 
    static async getBranches(req, res) {
        try {
            const branches = await FoodModel.getBranches();
            res.json(branches);  // Trả về danh sách chi nhánh
        } catch (error) {
            console.error('Error fetching branches:', error);
            res.status(500).send('Server Error');
        }
    }
    
    // Lấy phân loại món ăn
    static async getCategories(req, res) {
        try {
            const categories = await FoodModel.getCategories();
            res.json(categories);  // Trả về danh sách chi nhánh
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).send('Server Error');
        }
    }

    // Lấy chi nhánh theo ID khu vực
    static async getBranchesByArea(req, res) {
        const areaId = req.params.areaId;  // ID khu vực từ URL
        try {
            const branches = await FoodModel.getBranchesByArea(areaId);
            res.json(branches);  // Trả về danh sách chi nhánh
        } catch (error) {
            console.error('Error fetching branches:', error);
            res.status(500).send('Server Error');
        }
    }

    static async getFoodsbyBranch(req, res) {
        try {
            const { name, phone, email, identity, gender, area, branch, table, arrival_time } = req.query;

            // Tạo thông tin khách hàng từ request
            let customerInfo = { name, phone, email, identity, gender };

            // Kiểm tra hoặc tạo khách hàng
            let customer_id = await BooktableModel.checkOrCreateCustomer(customerInfo);
            
            // Thông tin để đặt bàn
            let tableinfo = { customer_id, table: Number(table), arrival_time};

            // Gọi phương thức để thêm đơn hàng mới
            let order_id = await BooktableModel.NewOrderforBooking(tableinfo);

            // Các bộ lọc để tìm kiếm món ăn
            let filters = {
                branch: branch || 'all',
                category: 'all',
                price: null,
                search: ''
            };

            // Gọi hàm tìm kiếm theo chi nhánh
            let foods = await FoodModel.searchFoodsByBranch(filters.branch);

            // Render kết quả
            res.render('user/customers', { foods, filters });
        } catch (error) {
            // Ghi log lỗi chi tiết
            console.error("Error occurred in getFoodsbyBranch:", error.message);
            res.status(500).json({ message: 'Error fetching food data', error });
        }
    }

}
module.exports = CustomersController;