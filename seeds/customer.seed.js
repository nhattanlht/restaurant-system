const { faker } = require('@faker-js/faker');
const date_of_birth = require('./birth_day.seed');

//customer_id: year(24) (year>2010) + month(11) + day(09) + gender(0: female, 1: male) + yearOfBirth(99) + number(xxxx)
//year month day -> account timestamps
function generateCustomerData(rowsCount) {
    const mockData = [];

    for (let i = 0; i < rowsCount; i++) {
        // Generate components of customer_id
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const day = String(new Date().getDate()).padStart(2, '0');
        const gender = faker.number.int({ min: 0, max: 1 });
        const yearOfBirth = date_of_birth.substring(0, 4);
        const randomNumber = faker.number.int({ min: 1000, max: 9999 });

        const gender_string = gender === 1 ? 'M' : 'F';
        const customer_id_string = `${currentYear}${month}${day}${gender}${yearOfBirth}${randomNumber}`;
        const customer_id = parseInt(customer_id_string, 10);
        const indetity_card_string = faker.number.int({ min: 100000000, max: 999999999 }).toString();
        // Convert member_card_number to a string to avoid validation errors

        const customer = {
            customer_id: customer_id,
            name: faker.person.fullName(),
            phone_number: faker.phone.number('0#########'),
            date_of_birth,
            email: faker.internet.email(),
            identity_card: indetity_card_string,
            gender: gender_string,
            card_type: faker.helpers.arrayElement(['Gold', 'Silver', 'Bronze']),
            accumulated_spending: faker.number.int({ min: 0, max: 100000 }),
            created_at: faker.date.past(2).toISOString(),
        };

        mockData.push(customer);
    }

    return mockData;
}

// Example usage
// console.log(generateCustomerData(5));
module.exports = generateCustomerData;
