const FoodModel = require('../../user/models/items.model');
const CategoryModel = require('../../user/models/categories.model');  // Assuming the Category model is set up
const BranchModel = require("../models/Branch.model");

class OrderItemsController {

    static async getFoods(req, res) {
        try {
            const { branch, category, price, search } = req.query;

            let filters = {
                branch: branch || 'all', //nhận từ client
                category: category || 'all',
                price: price ? parseInt(price) : null,
                search: search || ''

            };

            const categories = await CategoryModel.getAllCategories();
            const branches = await BranchModel.getAllBranches();
            let foods = await FoodModel.searchFoods(filters);
            res.render('admin/admin', {
                title: 'Order by Employees',
                branches,
                employees: null,
                revenueData: null,
                revenueItem: null,
                areas: null,
                managers: null,
                departments: null,
                invoices: null,
                customers: null,
                items: null,
                categories,
                message: null,
                foods,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching food data', error });
        }
    }

}

module.exports = OrderItemsController;