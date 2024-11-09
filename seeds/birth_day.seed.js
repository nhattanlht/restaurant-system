const { faker } = require('@faker-js/faker');

function generateDateOfBirth() {
    const age = faker.number.int({ min: 18, max: 100 });

    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;

    const birthMonth = faker.number.int({ min: 1, max: 12 });

    const birthDate = new Date(birthYear, birthMonth - 1, faker.number.int({ min: 1, max: 28 }));

    const formattedDate = birthDate.toISOString().split('T')[0];

    return formattedDate;
}

const date_of_birth = generateDateOfBirth();
module.exports = date_of_birth