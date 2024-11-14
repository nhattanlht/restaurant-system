const express = require('express')
const app = express()

const generateCustomerData = require('./customer.seed');
const NUMBER_LINE = 100000
// customer_data = generateCustomerData(1);
//
// console.log(customer_data);
// console.log(customer_data[0]);
// customer_data.forEach(customer => {
//     console.log(customer.member_card_number);
// });

app.get('/', (req, res) => {
    res.send(generateCustomerData(NUMBER_LINE));
})

app.listen(3000, () => {
    console.log('http server listening on port 3000');
})

// console.log(generateCustomerData(NUMBER_LINE))

