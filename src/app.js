const express = require('express')
const configViewEngine = require('./configs/engine.config')
// require('./db/init.mssql')

const layoutRoute = require('./routes')
const app = express()
const registerRoutes = require('./routes/access/register.route')
const loginRoutes = require('./routes/access/login.route');

const authenticateJWT = require('./middleware/auth.middleware'); // Import the authenticateJWT middleware

configViewEngine(app)



// init middleware

// routes
app.use('/', layoutRoute)
app.use('/register', registerRoutes);
app.use('/login', loginRoutes)

// template
// const newBranchRoutes = require('./routes/newBranch.route')
// app.use('/', newBranchRoutes)


app.get('/protected', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

app.use((err, req, res, next) => {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error message
});
//handle error


module.exports = app