const express = require('express');
const router = express.Router();

const forwardError = require('../../constants/forwardError');
const {authenticateV2} = require('../controllers/admin.controller');
const {authenticate} = require('../../shared/middleware/auth.middleware')

const {AdminController} = require("../controllers/admin.controller");
const employee = require("./employees.route");
const adminController = new AdminController();

//lấy danh sách
//241202002
router.get('/', authenticate, (adminController.getDashboard));
router.get('/branches', authenticate, (adminController.getBranch))
router.get('/employees', authenticate, (adminController.getEmployee))
router.get('/reports', authenticate, (adminController.getRevenueByBranch))
router.use('/', authenticate, employee);


//Thêm, Chỉnh sửa, xoá chi nhánh
router.post('/branches/add',authenticate,  adminController.addBranch); // Xử lý thêm chi nhánh
router.get('/branches/edit/:branch_id',authenticate,  adminController.getEditBranchForm); // Hiển thị form chỉnh sửa chi nhánh
router.post('/branches/edit/:branch_id',authenticate,  adminController.editBranch); // Xử lý cập nhật chi nhánh
router.get('/branches/delete/:branch_id',authenticate,  adminController.deleteBranch); // Xóa chi nhánh

//Thêm, chỉnh sửa, xoá nhân viên
router.post('/employees/add',authenticate,  adminController.addEmployee); // Xử lý thêm nhân viên
router.get('/employees/edit/:employee_id', authenticate, adminController.getEditEmployeeForm); // form edit thông tin nhân viên
router.post('/employees/edit/:employee_id', authenticate, adminController.editEmployee); // Cập nhật thông tin nhân viên
router.get('/employees/delete/:employee_id', authenticate, adminController.deleteEmployee); // Xóa nhân viên

//Cập nhật lương
router.put('/update-salary',authenticate,  adminController.updateSalaryByDepartmentName);

//Chuyển nhân sự
router.post('/employees/transfer', authenticate, adminController.transferEmployee);

module.exports = router;