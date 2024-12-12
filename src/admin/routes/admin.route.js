const express = require('express');
const router = express.Router();

const forwardError = require('../../constants/forwardError');
const {authenticateV2} = require('../controllers/admin.controller');
const {authenticate} = require('../../shared/middleware/auth.middleware')

const {AdminController} = require("../controllers/admin.controller");
const adminController = new AdminController();

router.get('/', authenticate, forwardError(adminController.getDashboard));
router.get('/branches', authenticate, forwardError(adminController.getBranch))
router.get('/employees', authenticate, forwardError(adminController.getEmployee))
router.get('/reports', authenticate, forwardError(adminController.getRevenueByBranch))

//Thêm, Chỉnh sửa, xoá chi nhánh
router.post('/branches/add', adminController.addBranch); // Xử lý thêm chi nhánh
router.get('/branches/edit/:branch_id', adminController.getEditBranchForm); // Hiển thị form chỉnh sửa chi nhánh
router.post('/branches/edit/:branch_id', adminController.editBranch); // Xử lý cập nhật chi nhánh
router.get('/branches/delete/:branch_id', adminController.deleteBranch); // Xóa chi nhánh
//Thêm, chỉnh sửa, xoá nhân viên

router.post('/employees/add', adminController.addEmployee); // Xử lý thêm nhân viên
router.get('/employees/edit/:employee_id', adminController.getEditEmployeeForm); // form edit thông tin nhân viên
router.post('/employees/edit/:employee_id', adminController.editEmployee); // Cập nhật thông tin nhân viên
router.get('/employees/delete/:employee_id', adminController.deleteEmployee); // Xóa nhân viên

//Cập nhật lương
router.put('/update-salary', adminController.updateSalaryByDepartmentName);

//Chuyển nhân sự
router.post('/transfer', adminController.transferEmployee);

module.exports = router;