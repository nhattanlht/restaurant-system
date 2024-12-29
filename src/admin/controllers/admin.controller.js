const CustomerModel = require("../../user/models/checkout.model");
const BranchModel = require("../models/Branch.model");
const EmployeeModel = require("../models/employee.model");
const ReportModel = require('../models/report.model');

function formatTime(time) {
  if (time instanceof Date) {
    // Nếu time là một đối tượng Date, ta sẽ lấy giờ, phút, giây từ đối tượng này
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  } else if (typeof time === 'string' && time.trim().length > 0) {
    // Nếu time là chuỗi, xử lý như bạn đã làm
    const timeParts = time.split(':');
    if (timeParts.length === 3) {
      return timeParts.map(part => part.padStart(2, '0')).join(':');
    }
  } else if (typeof time === 'number') {
    // Nếu time là số, ví dụ giờ, phút, giây được cung cấp riêng lẻ
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  // Nếu không hợp lệ, trả về giá trị mặc định '00:00:00'
  return '00:00:00';
}

// Hàm formatDay để chuẩn hóa ngày tháng
function formatDay(date) {
  if (date instanceof Date) {
    // Nếu date là đối tượng Date, chuyển sang định dạng 'YYYY-MM-DD'
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0, nên phải cộng thêm 1
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else if (typeof date === 'string' && date.trim().length > 0) {
    // Nếu date là chuỗi, thử tạo đối tượng Date từ chuỗi
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate)) {
      const year = parsedDate.getFullYear();
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = parsedDate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  // Nếu không hợp lệ, trả về giá trị mặc định '0000-00-00'
  return '0000-00-00';
}

//==============================Dashboard==========================
class AdminController {

  async getDashboard(req, res, netx) {
    try {
      // Render giao diện dashboard
      res.redirect('/admin/reports')
      res.render('admin/admin', {
        title: 'Admin Dashboard',
        branches: null,
        employees: null,
        revenueData: null,
        revenueItem: null,
        statistics: null, // Dữ liệu doanh thu được lấy từ model
        areas: null,
        managers: null,
        departments: null,
        message: null,
        customers: null,
        invoices: null,
        foods: null,
        items: null,
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
      res.status(500).send(err.message);
    }
  };

  //==============================Branch=========================

  async getBranch(req, res, netx) {
    try {
      const branches = await BranchModel.getAllBranches();
      const areas = await BranchModel.getAllAreas();
      const manager = await BranchModel.getAllManagers();
      const departments = await EmployeeModel.getAllDepartment();
      branches.forEach(branch => {
        const matchingManager = manager.find(manager => manager.employee_id === branch.manager);
        if (matchingManager) {
          // Thêm manager_name vào branch
          branch.manager_name = matchingManager.name;
        }
        branch.opening_time = formatTime(branch.opening_time);
        branch.closing_time = formatTime(branch.closing_time);
      });
      console.log(manager)
      res.render('admin/admin', {
        title: 'Branch List',
        branches: branches,
        employees: null,
        revenueData: null,
        revenueItem: null,
        statistics: null, // Dữ liệu doanh thu được lấy từ model
        areas: areas,
        managers: manager,
        departments: departments,
        message: null,
        customers: null,
        foods: null,
        invoices: null,
        items: null,
      });
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      res.status(500).send(error.message);
    }
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
      await BranchModel.addBranch({
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
      res.status(500).send(err.message);
    }
  };

  // Hiển thị form chỉnh sửa chi nhánh
  const
  getEditBranchForm = async (req, res) => {
    const { branch_id } = req.params;
    try {
      // Lấy thông tin chi nhánh từ model
      const branch = await BranchModel.getBranchById(branch_id);
      if (!branch) return res.status(404).send('Branch not found');
      res.render('admin/edit-branch', { title: 'Edit Branch', branch });
    } catch (err) {
      console.error('Error fetching branch:', err);
      res.status(500).send(err.message);    }
  };

  // Cập nhật thông tin chi nhánh
  const
  editBranch = async (req, res) => {
    const { branch_id } = req.params;
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
      manager,
    } = req.body;
    try {
      await BranchModel.updateBranch(branch_id, {
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
      res.status(500).send(err.message);    }
  };

  const
  deleteBranch = async (req, res) => {
    const { branch_id } = req.params; // Lấy branch_id từ URL
    try {
      const success = await BranchModel.deleteBranch(branch_id); // Gọi model để xóa chi nhánh
      if (success) {
        res.redirect('/admin/branches');
      } else {
        res.status(400).send('Failed to delete branch');
      }
    } catch (err) {
      console.error("Error in deleteBranch:", err);
      res.status(500).send(err.message);    }
  };


  //=============================Employee======================

  //lấy danh sách tất cả nhân viên
  async getEmployee(req, res, next) {
    try {
      const employees = await EmployeeModel.getAllEmployees();
      const departments = await EmployeeModel.getAllDepartment();
      const branches = await BranchModel.getAllBranches();
      employees.forEach(employee => {
        employee.DOB = formatDay(employee.DOB);
      });
      res.render('admin/admin', {
        title: 'employee-list',
        branches: branches,
        employees: employees,
        revenueData: null,
        revenueItem: null,
        statistics: null, // Dữ liệu doanh thu được lấy từ model
        areas: null,
        managers: null,
        departments: departments,
        message: null,
        customers: null,
        invoices: null,
        items: null,
        foods: null,
      });
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      res.status(500).send(error.message);    }
  }

  // Thêm nhân viên
  const
  addEmployee = async (req, res) => {
    try {
      await EmployeeModel.addEmployee(req.body);
      res.redirect('/admin/employees');
    } catch (err) {
      console.error('Error adding employee:', err);
      res.status(500).send(err.message);
    }
  };

  // Hiển thị form sửa nhân viên
  const
  getEditEmployeeForm = async (req, res) => {
    const { employee_id } = req.params;
    try {
      const employee = await EmployeeModel.getEmployeeById(employee_id);
      if (!employee) return res.status(404).send('Employee not found');
      res.render('admin/edit-employee', { title: 'Edit Employee', employee });
    } catch (err) {
      console.error('Error fetching employee:', err);
      res.status(500).send(err.message);
    }
  };

  // Cập nhật thông tin nhân viên
  const
  editEmployee = async (req, res) => {
    const { employee_id } = req.params;
    try {
      await EmployeeModel.editEmployee(employee_id, req.body);
      res.redirect('/admin/employees');
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(500).send(err.message);
    }
  };

  // Xóa nhân viên
  const
  deleteEmployee = async (req, res) => {
    const { employee_id } = req.params;
    try {
      await EmployeeModel.deleteEmployee(employee_id);
      res.redirect('/admin/employees');
    } catch (err) {
      console.error('Error deleting employee:', err);
      res.status(500).send(err.message);
    }
  };

  const
  updateSalaryByDepartmentName = async (req, res) => {
    const { departmentName, newSalary } = req.body;

    if (!departmentName || !newSalary || newSalary <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. Department name and salary are required.',
      });
    }

    try {
      const result = await EmployeeModel.updateSalary(departmentName, newSalary);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          success: false,
          message: `Department "${departmentName}" not found.`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Salary updated successfully for department "${departmentName}".`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error updating salary: ${error.message}`,
      });
    }
  };

  async handleTransferEmployee(req, res) {
    const { employeeId, newDeptId, newBranchId, transferDate, reason } = req.body;

    if (!employeeId || !newDeptId || !newBranchId || !transferDate) {
      return res.status(400).json({ success: false, message: 'All fields are required except reason.' });
    }

    const result = await EmployeeModel.transferEmployee(employeeId, newDeptId, newBranchId, transferDate, reason);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  }
  async transferEmployee(req, res) {
    const { employeeId, newBranchId } = req.body;

    try {
      await EmployeeModel.transferEmployee(employeeId, newBranchId);
      res.status(200).json({ success: true, message: "Employee transferred successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  //=============================Report=================================
  async getRevenueByBranch(req, res) {
    try {
      // Lấy các tham số lọc từ query string
      let { year, month, day } = req.query;
      // Gọi model để lấy dữ liệu doanh thu, truyền các tham số lọc
      const revenueData = await ReportModel.getRevenueByBranch(
        parseInt(year) || null, // Chuyển đổi thành số hoặc để null nếu không có
        parseInt(month) || null,
        parseInt(day) || null
      );
      const revenueItem = await ReportModel.getRevenueByItem(
        parseInt(year) || null, // Chuyển đổi thành số hoặc để null nếu không có
        parseInt(month) || null,
        parseInt(day) || null
      );

      const statistics = await ReportModel.getServiceReviewsByBranch();

      console.log(revenueItem)

      // Render view với dữ liệu doanh thu
      res.render('admin/admin', {
        title: 'Branch Revenue',
        branches: null, // Dữ liệu chi nhánh nếu cần, null ở đây do không sử dụng
        employees: null,
        revenueData: revenueData, // Dữ liệu doanh thu được lấy từ model
        revenueItem: revenueItem, // Dữ liệu doanh thu được lấy từ model
        statistics: statistics, // Dữ liệu doanh thu được lấy từ model
        areas: null,
        managers: null,
        departmets: null,
        message: null,
        customers: null,
        invoices: null,
        items: null,
        foods: null,
      });
    } catch (error) {
      console.error('Error in getRevenueByBranch:', error);
      res.status(500).send(error.message);
    }
  }

  //=============================Customers=================================
  static searchCustomer = async (req, res) => {
    try {
      const { criteria } = req.query;
      const customers = await CustomerModel.searchCustomer(criteria);
      const items = await ItemModel.getAllItems();
      const categories = await CategoryModel.getAllCategories();
      // Pass a flag to indicate if customers were found
      const message = customers.length === 0 ? "Find a customer" : null;
      res.render('admin/admin', {
        title: 'Admin Dashboard',
        branches: null,
        employees: null,
        revenueData: null,
        revenueItem: null,
        statistics: null, // Dữ liệu doanh thu được lấy từ model
        areas: null,
        managers: null,
        departments: null,
        customers,
        message,
        invoices: null,
        items,
        categories,
        foods: null,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}

module.exports = {
  AdminController,
};