const ItemModel = require('../models/itemEmployee.model');  // Assuming the Item model is set up for menu_item
const CategoryModel = require('../models/categories.model');  // Assuming the Category model is set up
const FoodModel = require('../models/items.model.js');

class OrderItemsController {
  
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
             // You can customize the message as needed or pass it as a query parameter
             const message = 'null'; // Replace with actual message logic if required

             // Set the active section as 'item-management' or any other relevant section
             const activeSection = 'order-items';
             
            const categories = await CategoryModel.getAllCategories();
            let foods = await FoodModel.searchFoods(filters);
            res.render('employees', {
                foods, 
                categories, 
                message, 
                activeSection, 
                filters: {},  // Optionally pass filter options if needed
                invoices: [], 
                customers: [],
                items:[],
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching food data', error });
        }
    }

}

module.exports = OrderItemsController;