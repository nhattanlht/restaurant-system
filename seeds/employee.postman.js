const { faker } = require('@faker-js/faker');
const e = require("express");
const fs = require("fs");

function generateEmployeeName(number){
    let employeeData = []
    for(let i = 1; i<=number; i++){
        const name = faker.person.fullName();
        const employee = {
            name: name,
            number: i
        }
        employeeData.push(employee)
    }
    return employeeData;
}
const users = generateEmployeeName(999)
const outputFile = 'employee_data.json';

// Ghi dữ liệu ra file
fs.writeFile(outputFile, JSON.stringify(users, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log(`User data has been written to ${outputFile}`);
    }
});