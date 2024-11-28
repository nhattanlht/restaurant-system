const app = require('./src/app');
const Database = require('./src/dbs/init.mssql'); // Import database kết nối
const db = new Database();
db.connect();


        // Lắng nghe kết nối đến server trên port 3000
        const PORT = 3001
        const server = app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

        // Xử lý khi nhận tín hiệu SIGINT để dừng server
        process.on('SIGINT', () => {
            server.close(() => {
                console.log('Exit server express');
            });
        });



