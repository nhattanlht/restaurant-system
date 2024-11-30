const express = require('express')
const configViewEngine = require('./configs/engine.config')
const layoutRoute = require('./routes/layout.route')
const app = express()
const registerRoutes = require('./routes/register.route')
const loginRoutes = require('./routes/login.route');


const authenticateJWT = require('./middleware/auth.middleware'); // Import the authenticateJWT middleware
//Employee
const foodFilterRoutes = require('./routes/search_filter.route.js'); 
configViewEngine(app)
const path = require('path'); // Thêm dòng này để sử dụng `path`



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

app.use('/login', loginRoutes)

app.use('', foodFilterRoutes);
app.get('/protected', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

app.use((err, req, res, next) => {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error message
});
//handle error


module.exports = app