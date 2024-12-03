// const express = require("express");
// const router = express.Router();
// const adminController = require('../controllers/admin.controller.js');

// // --- Quản lý chi nhánh ---
// router.get('/', adminController.getDashboard); // Xem danh sách chi nhánh
// router.get('/branches', adminController.getBranch); // Xem danh sách chi nhánh
// router.get('/branches/add', adminController.getAddBranchForm); // Hiển thị form thêm chi nhánh
// router.post('/branches/add', adminController.addBranch); // Xử lý thêm chi nhánh
// router.get('/branches/edit/:branch_id', adminController.getEditBranchForm); // Hiển thị form chỉnh sửa chi nhánh
// router.post('/branches/edit/:branch_id', adminController.editBranch); // Xử lý cập nhật chi nhánh
// router.get('/branches/delete/:branch_id', adminController.deleteBranch); // Xóa chi nhánh

// // // --- Quản lý nhân sự ---
// router.get('/employees', adminController.getEmployeeList); // Xem danh sách nhân viên
// router.get('/employees/add', adminController.getAddEmployeeForm); // Hiển thị form thêm nhân viên
// router.post('/employees/add', adminController.addEmployee); // Xử lý thêm nhân viên
// router.get('/employees/delete/:employee_id', adminController.deleteEmployee); // Xóa nhân viên
// router.get('/employees/edit/:employee_id', adminController.getEditEmployeeForm); // Sửa thông tin nhân viên
// router.post('/employees/edit/:employee_id', adminController.editEmployee); // Cập nhật thông tin nhân viên

// // // --- Báo cáo và thống kê ---
// // router.get('/reports/revenue', adminController.getRevenueReport); // Báo cáo doanh thu
// // router.get('/reports/best-sellers', adminController.getBestSellers); // Báo cáo các món ăn bán chạy
// // router.get('/reports/employee-performance', adminController.getEmployeePerformance); // Báo cáo hiệu suất nhân viên

// module.exports = router;

const express = require('express');
const router = express.Router();
const BranchModel = require('../models/Branch.model');
const EmployeeModel = require('../models/Employee.model');
// Hiển thị dashboard admin
const forwardError = require('../../constants/forwardError');
const {authenticateV2} = require('../controllers/admin.controller');
const {authenticate} = require('../../shared/middleware/auth.middleware')
const {AdminController} = require("../controllers/admin.controller");
const adminController = new AdminController();
router.get('/', authenticate, forwardError(adminController.getDashboard));
router.get('/branches', authenticate, forwardError(adminController.getBranch))
router.get('/employees', authenticate, forwardError(adminController.getEmployee))


// // Thêm chi nhánh
// router.post('/branches/add', async (req, res) => {
//     try {
//         await BranchModel.addBranch(req.body);
//         res.redirect('/admin');
//     } catch (error) {
//         console.error('Error adding branch:', error);
//         res.status(400).send('Error adding branch');
//     }
// });
//
// // Thêm nhân viên
// router.post('/employees/add', async (req, res) => {
//     try {
//         await EmployeeModel.addEmployee(req.body);
//         res.redirect('/admin');
//     } catch (error) {
//         console.error('Error adding employee:', error);
//         res.status(400).send('Error adding employee');
//     }
// });

module.exports = router;