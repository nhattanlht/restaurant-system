const {faker} = require('@faker-js/faker')

function generateUserData(rowsCount){
    const mockData = [];
    for(let i = 0; i < rowsCount; i++){
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const day = String(new Date().getDate()).padStart(2, '0');
        const randomNumber = faker.number.int({ min: 1000, max: 9999 });
    }
}