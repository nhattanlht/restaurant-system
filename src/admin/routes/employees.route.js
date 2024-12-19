const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employees.controller');
const ItemController = require('../controllers/ItemController');
const ReportInvoicesController = require('../controllers/reportInvoices.controller');
const OrderItemsController = require('../controllers/orderitems.controller');
const CartController = require('../../user/controllers/cart.controller');


router.get('/admin', EmployeeController.searchCustomer)
// Route to handle search of items
router.get('/items', ItemController.getAllItems);
router.get('/items/search', ItemController.searchItems);
router.post('/items/add', ItemController.addItem);
// Route to update an item
router.post('/items/:itemId/update', ItemController.updateItem);
// Route to delete an item
router.post('/items/:itemId/delete', ItemController.deleteItem);

//report invoices

router.get('/report-invoices', ReportInvoicesController.reportInvoices);

//customer
router.get('/customer/search', EmployeeController.searchCustomer);
router.post('/:customerId/update', EmployeeController.updateCustomer);
router.post('/:customerId/delete', EmployeeController.deleteCustomer);
router.post('/add', EmployeeController.insertCustomer);

//order and cart
router.get('/order', OrderItemsController.getFoods);
router.get('/order/results', OrderItemsController.getFoodsJson);

router.post('/cart/remove', CartController.removeItemFromCart);
router.post('/cart/update', CartController.updateItemQuantity);
router.post('/cart/add', CartController.addToCart);
router.post('/cart/save',CartController.saveCartToDatabase);

module.exports = router;
