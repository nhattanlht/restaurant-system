const express = require('express')
const session = require('express-session'); // Đảm bảo đã import express-session
const configViewEngine = require('./configs/engine.config')
const layoutRoute = require('./routes/layout.route')
const app = express()


const registerRoutes = require('./routes/register.route')
const loginRoutes = require('./routes/login.route');

const authenticateJWT = require('./middleware/auth.middleware'); // Import the authenticateJWT middleware
//Employee
const customer = require('./routes/customers.route.js'); 
const cart=require('./routes/cart.route.js');
const employee=require('./routes/employees.route.js');
configViewEngine(app)
const path = require('path'); // Thêm dòng này để sử dụng `path`
//Checkout
const checkoutRoute=require('./routes/checkout.route.js');
//Session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // Thời gian sống của session (ở đây là 24 giờ)
    }
}));
// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//init db
require('./db/init.mssql')

// routes
app.use('/', layoutRoute)
app.use('/register', registerRoutes);
app.use('',checkoutRoute);
app.use('/login', loginRoutes);
app.use('',cart);
app.use('', customer);
app.use('/employees', employee);

// Định nghĩa route API
app.use('/api', customer);

app.get('/protected', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

app.use((err, req, res, next) => {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error message
});
//handle error


module.exports = app