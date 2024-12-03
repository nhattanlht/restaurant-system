const adminModel = require('../models/admin.model');
const BranchModel = require("../models/Branch.model");
const EmployeeModel = require("../models/employee.model");
//==============================Dashboard==========================
class AdminController {

  async getDashboard(req, res, netx) {
    try {
      // Render giao diện dashboard
      res.render('admin/admin', {
        title: 'Admin Dashboard',
        branches: null,
        employees: null,
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
      res.status(500).send('Internal Server Error');
    }
  };

//==============================Branch==========================
  async getBranch(req, res, netx) {
    try {
      const branches = await BranchModel.getAllBranches();
      console.log(branches)
      res.render('admin/admin', {
        title: 'Branch List',
        branches: branches,
        employees: null,
      });
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      res.status(500).send('Internal Server Error');
    }
  };


  async getEmployee(req, res, next) {
    try {
      const employees = await EmployeeModel.getAllEmployees();
      res.render('admin/admin', {
        title: 'Branch List',
        branches: null,
        employees: employees,
      });
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  const
  getAddBranchForm = (req, res) => {
    res.render("admin/add-branch");
  };

  const
  addBranch = async (req, res) => {
    const {
      branch_name,
      address,
      opening_time,
      closing_time,
      status,
      phone_number,
      has_motorbike_parking,
      has_car_parking,
      area_id,
      manager
    } = req.body;
    try {
      await adminModel.addBranch({
        branch_name,
        address,
        opening_time,
        closing_time,
        status,
        phone_number,
        has_motorbike_parking,
        has_car_parking,
        area_id,
        manager
      });
      res.redirect('/admin/branches');
    } catch (err) {
      console.error("Error in addBranch:", err);
      res.status(500).send("Internal Server Error");
    }
  };

// Hiển thị form chỉnh sửa chi nhánh
  const
  getEditBranchForm = async (req, res) => {
    const {branch_id} = req.params;
    try {
      // Lấy thông tin chi nhánh từ model
      const branch = await adminModel.getBranchById(branch_id);
      if (!branch) return res.status(404).send('Branch not found');
      res.render('admin/edit-branch', {title: 'Edit Branch', branch});
    } catch (err) {
      console.error('Error fetching branch:', err);
      res.status(500).send('Internal Server Error');
    }
  };

// Cập nhật thông tin chi nhánh
  const
  editBranch = async (req, res) => {
    const {branch_id} = req.params;
    const {
      branch_name,
      address,
      opening_time,
      closing_time,
      status,
      phone_number,
      has_motorbike_parking,
      has_car_parking,
      area_id,
      manager
    } = req.body;
    try {
      await adminModel.updateBranch(branch_id, {
        branch_name,
        address,
        opening_time,
        closing_time,
        status,
        phone_number,
        has_motorbike_parking,
        has_car_parking,
        area_id,
        manager
      });
      res.redirect('/admin/branches');
    } catch (err) {
      console.error("Error in editBranch:", err);
      res.status(500).send("Internal Server Error");
    }
  };

  const
  deleteBranch = async (req, res) => {
    const {branch_id} = req.params; // Lấy branch_id từ URL
    try {
      const success = await adminModel.deleteBranch(branch_id); // Gọi model để xóa chi nhánh
      if (success) {
        res.status(200).send('Branch deleted successfully');
      } else {
        res.status(400).send('Failed to delete branch');
      }
    } catch (err) {
      console.error("Error in deleteBranch:", err);
      res.status(500).send('Internal Server Error');
    }
  };


//=============================Employee======================
// Hiển thị danh sách nhân viên
  const
  getEmployeeList = async (req, res) => {
    try {
      const employees = await adminModel.getEmployees();
      res.render('admin/employee-list', {title: 'Employee Management', employees});
    } catch (err) {
      console.error('Error fetching employees:', err);
      res.status(500).send('Internal Server Error');
    }
  };

// Thêm nhân viên
  const
  addEmployee = async (req, res) => {
    try {
      await adminModel.addEmployee(req.body);
      res.redirect('admin/employees-list');
    } catch (err) {
      console.error('Error adding employee:', err);
      res.status(500).send('Internal Server Error');
    }
  };

// Hiển thị form thêm nhân viên
  const
  getAddEmployeeForm = (req, res) => {
    try {
      res.render('admin/add-employee', {
        title: 'Thêm Nhân Viên',
      });
    } catch (err) {
      console.error('Error rendering add employee form:', err);
      res.status(500).send('Internal Server Error');
    }
  };

// Hiển thị form sửa nhân viên
  const
  getEditEmployeeForm = async (req, res) => {
    const {employee_id} = req.params;
    try {
      const employee = await adminModel.getEmployeeById(employee_id);
      if (!employee) return res.status(404).send('Employee not found');
      res.render('admin/edit-employee', {title: 'Edit Employee', employee});
    } catch (err) {
      console.error('Error fetching employee:', err);
      res.status(500).send('Internal Server Error');
    }
  };

// Cập nhật thông tin nhân viên
  const
  editEmployee = async (req, res) => {
    const {employee_id} = req.params;
    try {
      await adminModel.editEmployee(employee_id, req.body);
      res.redirect('/admin/employees');
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(500).send('Internal Server Error');
    }
  };

// Xóa nhân viên
  const
  deleteEmployee = async (req, res) => {
    const {employee_id} = req.params;
    try {
      await adminModel.deleteEmployee(employee_id);
      res.redirect('/admin/employees');
    } catch (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send('Internal Server Error');
    }
  };
}
module.exports = {
 AdminController
};