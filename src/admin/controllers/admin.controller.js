const adminModel = require('../models/admin.model');
const BranchModel = require("../models/Branch.model");
const EmployeeModel = require("../models/employee.model");
const ReportModel = require('../models/report.model');
//==============================Dashboard==========================
class AdminController {

  async getDashboard(req, res, netx) {
    try {
      res.redirect('/admin/reports')
      // Render giao diện dashboard
      res.render('admin/admin', {
        title: 'Admin Dashboard',
        branches: null,
        employees: null,
        revenueData: null,
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
        revenueData:null,
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
        revenueData:null,
      });
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      res.status(500).send('Internal Server Error');
    }
  }

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
        res.redirect('/admin/branches');
      } else {
        res.status(400).send('Failed to delete branch');
      }
    } catch (err) {
      console.error("Error in deleteBranch:", err);
      res.status(500).send('Internal Server Error');
    }
  };


//=============================Employee======================

// Thêm nhân viên
  const
  addEmployee = async (req, res) => {
    try {
      await adminModel.addEmployee(req.body);
      res.redirect('/admin/employees');
    } catch (err) {
      console.error('Error adding employee:', err);
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
      res.redirect('/');
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

        // Render view với dữ liệu doanh thu
        res.render('admin/admin', { 
            title: 'Branch Revenue',
            branches: null, // Dữ liệu chi nhánh nếu cần, null ở đây do không sử dụng
            employees: null, // Dữ liệu nhân viên nếu cần, null ở đây do không sử dụng
            revenueData: revenueData, // Dữ liệu doanh thu được lấy từ model
        });
    } catch (error) {
        console.error('Error in getRevenueByBranch:', error);
        res.status(500).send('Internal Server Error'); // Gửi phản hồi lỗi nếu có vấn đề xảy ra
    }
  }

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
    const { employeeId, newDeptId, newBranchId, transferDate } = req.body;

    try {
        await employeeModel.transferEmployee(employeeId, newDeptId, newBranchId, transferDate);
        res.status(200).json({ success: true, message: "Employee transferred successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
}
//=============================Report=================================

module.exports = {
 AdminController,
};