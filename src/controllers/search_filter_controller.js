const FilterModel = require('../models/product.model.js');

class FilterController {
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
            let foods = await FilterModel.searchFoods(filters);
            res.render('filter', { foods, filters });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching food data', error });
        }
    }

    static async renderFoods(req, res) {
        try {
            // Lấy tất cả món ăn từ model
            let foods = await FilterModel.getAllFoods(); // Gọi hàm getAllFoods trong model

            // Render trang với tất cả món ăn và các bộ lọc (filters)
            res.render('filter', { foods, filters: {} });
        } catch (error) {
            // Nếu có lỗi, trả về mã lỗi 500 với thông báo lỗi
            res.status(500).json({ message: 'Lỗi khi lấy dữ liệu món ăn', error });
        }
    }

    // Lấy danh sách khu vực
    static async getAllAreas(req, res) {
        try {
            const areas = await FilterModel.getAreas();
            res.json(areas);  // Trả về danh sách khu vực
        } catch (error) {
            console.error('Error fetching areas:', error);
            res.status(500).send('Server Error');
        }
    }

    // Lấy chi nhánh theo ID khu vực
    static async getBranchesByArea(req, res) {
        const areaId = req.params.areaId;  // ID khu vực từ URL
        try {
            const branches = await FilterModel.getBranchesByArea(areaId);
            res.json(branches);  // Trả về danh sách chi nhánh
        } catch (error) {
            console.error('Error fetching branches:', error);
            res.status(500).send('Server Error');
        }
    }

}
module.exports = FilterController;