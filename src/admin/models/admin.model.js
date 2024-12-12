const sql = require("mssql");
const dev_config = require('../../configs/mssql.config');

// ====================================Branch=============================
//Xem chi nhánh
const getBranches = async () => {
  try {
    const pool = await sql.connect(dev_config);
    const result = await pool.request().query("SELECT * FROM Branch");
    return result.recordset; // Trả về danh sách chi nhánh
  } catch (err) {
    console.error("Error fetching branches from database:", err);
    throw err;
  }
};

// Lấy thông tin một chi nhánh theo branch_id
const getBranchById = async (branch_id) => {
  try {
    const pool = await sql.connect(dev_config);
    const result = await pool.request()
        .input('branch_id', sql.Int, branch_id)
        .query('SELECT * FROM Branch WHERE branch_id = @branch_id');

    return result.recordset[0]; // Trả về chi nhánh đầu tiên (nếu có)
  } catch (err) {
    console.error('Error fetching branch by ID:', err);
    throw err;
  }
};


// Thêm chi nhánh
const addBranch = async (branchData) => {
  const { branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager } = branchData;
  try {

    // Chuyển đổi chuỗi thành thời gian (giả sử định dạng là HH:mm:ss)
    const parseTime = (timeString) => {
      // Kiểm tra xem chuỗi có đúng định dạng không (HH:mm:ss)
      const timeParts = timeString.split(':');
      if (timeParts.length !== 3) {
        throw new Error(`Invalid time format for: ${timeString}`);
      }
      // Đảm bảo rằng các phần của thời gian là số hợp lệ
      const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));
      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
        throw new Error(`Invalid time value for: ${timeString}`);
      }
      // Trả về đối tượng Date với thời gian xác định
      const now = new Date();
      now.setHours(hours, minutes, seconds, 0);
      return now;
    };

    // Chuyển đổi opening_time và closing_time thành Date objects
    const openingTime = parseTime(opening_time);
    const closingTime = parseTime(closing_time);

    const pool = await sql.connect(dev_config);
    const result = await pool.request()
        .input('branch_name', sql.NVarChar, branch_name)
        .input('address', sql.NVarChar, address)
        .input('opening_time', sql.Time, openingTime)
        .input('closing_time', sql.Time, closingTime)
        .input('status', sql.NVarChar, status)
        .input('phone_number', sql.NVarChar, phone_number)
        .input('has_motorbike_parking', sql.Bit, has_motorbike_parking)
        .input('has_car_parking', sql.Bit, has_car_parking)
        .input('area_id', sql.Int, area_id)
        .input('manager', sql.Int, manager)
        .query(`
        INSERT INTO Branch (branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager)
        VALUES (@branch_name, @address, @opening_time, @closing_time, @status, @phone_number, @has_motorbike_parking, @has_car_parking, @area_id, @manager)
      `);
    return result.rowsAffected > 0;
  } catch (err) {
    console.error('Error adding branch:', err);
    throw err;
  }
};

// Cập nhật thông tin chi nhánh
const updateBranch = async (branch_id, branchData) => {
  const { branch_name, address, opening_time, closing_time, status, phone_number, has_motorbike_parking, has_car_parking, area_id, manager } = branchData;
  try {
    // Chuyển đổi chuỗi thành thời gian (giả sử định dạng là HH:mm:ss)
    const parseTime = (timeString) => {
      // Kiểm tra xem chuỗi có đúng định dạng không (HH:mm:ss)
      const timeParts = timeString.split(':');
      if (timeParts.length !== 3) {
        throw new Error(`Invalid time format for: ${timeString}`);
      }
      // Đảm bảo rằng các phần của thời gian là số hợp lệ
      const [hours, minutes, seconds] = timeParts.map(part => parseInt(part, 10));
      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
        throw new Error(`Invalid time value for: ${timeString}`);
      }
      // Trả về đối tượng Date với thời gian xác định
      const now = new Date();
      now.setHours(hours, minutes, seconds, 0);
      return now;
    };

    // Chuyển đổi opening_time và closing_time thành Date objects
    const openingTime1 = parseTime(opening_time);
    const closingTime1 = parseTime(closing_time);

    const pool = await sql.connect(dev_config);
    await pool.request()
        .input('branch_id', sql.Int, branch_id)
        .input('branch_name', sql.NVarChar, branch_name)
        .input('address', sql.NVarChar, address)
        .input('opening_time', sql.Time, openingTime1)
        .input('closing_time', sql.Time, closingTime1)
        .input('status', sql.NVarChar, status)
        .input('phone_number', sql.NVarChar, phone_number)
        .input('has_motorbike_parking', sql.Bit, has_motorbike_parking)
        .input('has_car_parking', sql.Bit, has_car_parking)
        .input('area_id', sql.Int, area_id)
        .input('manager', sql.Int, manager)
        .query(`
              UPDATE Branch 
              SET branch_name = @branch_name, 
                  address = @address, 
                  opening_time = @opening_time, 
                  closing_time = @closing_time, 
                  status = @status, 
                  phone_number = @phone_number, 
                  has_motorbike_parking = @has_motorbike_parking, 
                  has_car_parking = @has_car_parking, 
                  area_id = @area_id, 
                  manager = @manager 
              WHERE branch_id = @branch_id
          `);
    return true;
  } catch (err) {
    console.error('Error updating branch:', err);
    throw err;
  }
};

// Xóa chi nhánh
const deleteBranch = async (branch_id) => {
  try {
    const pool = await sql.connect(dev_config);
    const result = await pool.request()
        .input('branch_id', sql.Int, branch_id)
        .query('DELETE FROM Branch WHERE branch_id = @branch_id');
    return result.rowsAffected > 0;
  } catch (err) {
    console.error('Error deleting branch:', err);
    throw err;
  }
};

//===================Employee=========================
// Lấy danh sách nhân viên
const getEmployees = async () => {
  try {
    const pool = await sql.connect(dev_config);
    const result = await pool.request().query("SELECT * FROM Employee");
    return result.recordset; // Trả về danh sách nhân viên
  } catch (err) {
    console.error("Error fetching employees from database:", err);
    throw err;
  }
};

// Lấy thông tin một nhân viên theo employee_id
const getEmployeeById = async (employee_id) => {
  try {
    const pool = await sql.connect(dev_config);
    const result = await pool.request()
        .input('employee_id', sql.Int, employee_id) // Thêm input cho employee_id
        .query('SELECT * FROM Employee WHERE employee_id = @employee_id');

    return result.recordset[0]; // Trả về nhân viên đầu tiên (nếu có)
  } catch (err) {
    console.error('Error fetching employee by ID:', err);
    throw err;
  }
};

// Thêm mới nhân viên
const addEmployee = async ({employee_id, name, DOB, gender, dept_id, address, phone_number, user_id, branch_id }) => {
  try {
    const pool = await sql.connect(dev_config);
    const result = await pool.request()
        .input('employee_id', sql.Int, employee_id)
        .input('name', sql.NVarChar, name)
        .input('DOB', sql.Date, DOB)
        .input('gender', sql.Char, gender)
        .input('dept_id', sql.Int, dept_id)
        .input('address', sql.NVarChar, address)
        .input('phone_number', sql.NVarChar, phone_number)
        .input('user_id', sql.Int, user_id)
        .input('branch_id', sql.Int, branch_id)
        .query(`
        INSERT INTO Employee (employee_id, name, DOB, gender, dept_id, address, phone_number, user_id, branch_id) 
        VALUES (@employee_id ,@name, @DOB, @gender, @dept_id, @address, @phone_number, @user_id, @branch_id)
      `);

    return result.rowsAffected > 0; // Trả về true nếu thêm thành công
  } catch (err) {
    console.error('Error adding employee:', err);
    throw err;
  }
};

const editEmployee = async (employee_id, updates) => {
  const { name, DOB, gender, dept_id, address, phone_number, user_id } = updates;
  try {
    const pool = await sql.connect(dev_config);
    await pool.request()
        .input('employee_id', sql.Int, employee_id)
        .input('name', sql.NVarChar, name)
        .input('DOB', sql.Date, DOB)
        .input('gender', sql.Char, gender)
        .input('dept_id', sql.Int, dept_id)
        .input('address', sql.NVarChar, address)
        .input('phone_number', sql.NVarChar, phone_number)
        .input('user_id', sql.Int, user_id)
        .query(`
              UPDATE Employee 
              SET name = @name, 
                  DOB = @DOB, 
                  gender = @gender, 
                  dept_id = @dept_id, 
                  address = @address, 
                  phone_number = @phone_number, 
                  user_id = @user_id 
              WHERE employee_id = @employee_id
          `);
    return true; // Trả về true nếu cập nhật thành công
  } catch (err) {
    console.error('Error updating employee:', err);
    throw err; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};


// Xóa nhân viên
const deleteEmployee = async (employee_id) => {
  try {
    const pool = await sql.connect(dev_config);
    const result = await pool.request()
        .input('employee_id', sql.Int, employee_id) // Thêm input cho employee_id
        .query('DELETE FROM Employee WHERE employee_id = @employee_id');

    // Kiểm tra xem có dòng nào bị xóa hay không
    return result.rowsAffected > 0; // Trả về true nếu xóa thành công
  } catch (err) {
    console.error('Error deleting employee:', err);
    throw err; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

module.exports = {
  getBranches,
  getBranchById,
  addBranch,
  updateBranch,
  deleteBranch,
  getEmployees,
  getEmployeeById,
  addEmployee,
  editEmployee,
  deleteEmployee,
};