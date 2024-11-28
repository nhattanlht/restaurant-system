const fs = require('fs');
const axios = require('axios');

// Đọc dữ liệu từ user_data.json
const users = JSON.parse(fs.readFileSync('./user_data.json', 'utf8'));
// console.log(users);
// Gửi từng request POST
users.forEach(async (user) => {
    try {
        const response = await axios.post('http://localhost:3000/register', {
            username: user.user_name,
            email: user.email,
            password: user.password,
            confirm_password: user.confirm_password,
        });
        console.log(`User ${user.user_name} registered:`, response.status);
    } catch (err) {
        console.error(`Error with user ${user.user_name}:`, err.message);
    }
});
