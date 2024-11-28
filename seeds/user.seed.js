const {faker} = require('@faker-js/faker')
const fs = require('fs'); // Thư viện để ghi file

function generateUserData(){
    const Number_Line = 50000
    const userData = []
    for(let i = 0; i < Number_Line; i++) {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const password = 'Nghia@1234'
        const confirm_password = password

        const user = {
            user_name: name,
            email: email,
            password: password,
            confirm_password: confirm_password,
        }
        userData.push(user)
    }
    return userData
}

const users = generateUserData();
const outputFile = 'user_data.json';

// Ghi dữ liệu ra file
fs.writeFile(outputFile, JSON.stringify(users, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log(`User data has been written to ${outputFile}`);
    }
});