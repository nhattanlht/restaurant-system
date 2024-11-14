const express = require('express')
const app = express()

const generateCustomerData = require('./customer.seed');
const NUMBER_LINE = 100000
const customer_data = generateCustomerData('1');
let customer_id;
customer_data.forEach(customer => {
    customer_id = customer.customer_id;
});
console.log(customer_id)
// app.get('/', (req, res) => {
//     res.send(generateCustomerData(NUMBER_LINE));
// })
//
// app.listen(3000, () => {
//     console.log('http server listening on port 3000');
// })

// console.log(generateCustomerData(NUMBER_LINE))

