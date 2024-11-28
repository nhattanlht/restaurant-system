const { faker } = require('@faker-js/faker');

function generateEmployeeID(number){

    const currentYear = new Date().getFullYear().toString().slice(-2);
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    const currentDay = String(new Date().getDate()).padStart(2, '0');
    let employee_id_string = `${currentYear}${currentMonth}${currentDay}`
    if(number < 10) employee_id_string += '00' + number
    else if(number < 100) employee_id_string += '0' + number
    else employee_id_string += number

    return parseInt(employee_id_string, 10);
}


module.exports = generateEmployeeID