'use strict'
const sql = require('mssql')
const TABLE_NAME = 'Branch'

class BranchModel{
    constructor(pool){
        this.pool = pool
    }

    static async insertNewBranch(branchData, transaction) {
        try {
            const request = transaction.request();

            // Gắn dữ liệu vào request
            request.input('branch_name', branchData.branch_name);

            // Gọi stored procedure để thêm dữ liệu
            const result = await request.execute('SP_AddNewBranch_TEMP');

            // Trả về kết quả thực thi
            return result;
        } catch (error) {
            console.error('Error inserting new branch:', error);
            throw error; // Ném lỗi để xử lý tại nơi gọi hàm
        }
    }

}

module.exports = BranchModel