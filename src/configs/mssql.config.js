'use strict'

const dev_config = {
    user: process.env.DEV_DB_USER,       // Tên người dùng
    password: process.env.DEV_DB_PASSWORD,  // Mật khẩu
    server: process.env.DEV_DB_SERVER, // Public IP của SQL Server instance
    port: parseInt(process.env.DEV_DB_PORT, 10),              // Port mặc định của SQL Server
    database: process.env.DEV_DB_NAME, // Thay bằng tên database của bạn
    options: {
        trustServerCertificate: true // Chỉ cần khi không có chứng chỉ SSL
    }
};
module.exports = dev_config


