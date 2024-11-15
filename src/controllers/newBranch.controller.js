
const getNewBranch = (req, res) => {
    res.render('insertNewBranch')
}
const sql = require('mssql');

class NewBranchController {
    static async newBranch(req, res, next) {
        try {
            const { branch_name } = req.body;

            // Kiểm tra dữ liệu đầu vào
            //services
            if (!branch_name) {
                return res.status(400).json({ error: "Branch name is required" });
            }

            const pool = await sql.connect(); // Kết nối SQL Server
            const request = pool.request();

            // Thêm tham số cho stored procedure
            request.input('branch_name', sql.NVarChar(255), branch_name);

            // Gọi stored procedure
            const result = await request.execute('SP_AddNewBranch_TEMP');

            // Xử lý kết quả trả về
            if (result.recordset && result.recordset.length > 0) {
                const newBranchId = result.recordset[0].branch_id; // Lấy branch_id
                return res.status(201).json({
                    message: "Branch created successfully",
                    branch_id: newBranchId,
                });
            } else {
                return res.status(500).json({
                    error: "Failed to retrieve new branch ID",
                });
            }
        } catch (error) {
            console.error("Error creating branch:", error);
            return res.status(500).json({ error: "Error creating branch" });
        }
    }
}



module.exports = { NewBranchController, getNewBranch };

