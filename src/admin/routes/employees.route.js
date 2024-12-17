const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employees.controller');
const ItemController = require('../controllers/ItemController');
const ReportInvoicesController=require('../controllers/reportInvoices.controller');

// Route to handle search of items
router.get('/items',ItemController.getAllItems);
router.get('/items/search', ItemController.searchItems);  
router.post('/items/add', ItemController.addItem);
// Route to update an item
router.post('/items/:itemId/update', ItemController.updateItem);
// Route to delete an item
router.post('/items/:itemId/delete', ItemController.deleteItem);

//report invoices

router.get('/report-invoices',ReportInvoicesController.reportInvoices);


router.get('/customer/search', EmployeeController.searchCustomer);
router.post('/:customerId/update', EmployeeController.updateCustomer);
router.post('/:customerId/delete', EmployeeController.deleteCustomer);
router.post('/add', EmployeeController.insertCustomer);

module.exports = router;
