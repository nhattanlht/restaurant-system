const fs = require('fs');
const axios = require('axios');

// Đọc dữ liệu từ user_data.json
const users = JSON.parse(fs.readFileSync('./employee_data.json', 'utf8'));
// console.log(users);
// Gửi từng request POST
users.forEach(async (employees) => {
    try {
        const response = await axios.post('http://localhost:3000/admin/post', {
            name: employees.name,
            number: employees.number
        });
        console.log(`Employee ${employees.name}, ${employees.number} registered:`, response.status);
    } catch (err) {
        console.error(`Error with Employee ${employees.number}:`, err.message);
    }
});
