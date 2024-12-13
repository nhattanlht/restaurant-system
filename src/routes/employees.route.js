const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employees.controller');

router.get('/', EmployeeController.searchCustomer);
router.post('/:customerId/update', EmployeeController.updateCustomer);
router.post('/:customerId/delete', EmployeeController.deleteCustomer);

module.exports = router;
