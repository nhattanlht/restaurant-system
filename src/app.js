const express = require('express')
const configViewEngine = require('./configs/engine.config')
const layoutRoute = require('./routes/layout.route')
const app = express()
const registerRoutes = require('./routes/register.route')
const loginRoutes = require('./routes/login.route');

const authenticateJWT = require('./middleware/auth.middleware'); // Import the authenticateJWT middleware

configViewEngine(app)



// init middleware

//init db
require('./db/init.mssql')

// routes
// app.use('/', layoutRoute)
// app.use('/register', registerRoutes);
// app.use('/login', loginRoutes)

const newBranchRoutes = require('./routes/newBranch.route')
app.use('/', newBranchRoutes)


app.get('/protected', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

app.use((err, req, res, next) => {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error message
});
//handle error


module.exports = app