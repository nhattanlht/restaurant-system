const app = require('./src/app');
const Database = require("./src/dbs/init.mssql");
// dbs
const db = new Database();
db.connect();

        const PORT = 3000
        const server = app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

        // Xử lý khi nhận tín hiệu SIGINT để dừng server
        process.on('SIGINT', () => {
            server.close(() => {
                console.log('Exit server express');
            });
        });



// const cluster = require('cluster');
// const os = require('os');
// const app = require('./src/app');
// const Database = require("./src/dbs/init.mssql");
// // dbs
// const db = new Database();
// db.connect();
// const PORT = process.env.PORT;
//
// if (cluster.isMaster) {
//     // Nếu là tiến trình chính (Master)
//     const numCPUs = os.cpus().length;
//
//     console.log(`Master process ${process.pid} is running`);
//     console.log(`Forking ${numCPUs} workers...`);
//
//     // Tạo một worker cho mỗi CPU
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }
//
//     // Lắng nghe sự kiện worker thoát
//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
//         console.log('Starting a new worker...');
//         cluster.fork();
//     });
// } else {
//     // Nếu là tiến trình worker
//     const server = app.listen(PORT, () => {
//         console.log(`Worker ${process.pid} running at http://localhost:${PORT}`);
//     });
//
//     // Xử lý khi nhận tín hiệu SIGINT
//     process.on('SIGINT', () => {
//         server.close(() => {
//             console.log(`Worker ${process.pid} shutting down`);
//         });
//     });
// }
