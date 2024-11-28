const express = require('express')
const configViewEngine = require('./configs/engine.config')
const app = express()

const layoutRoute = require('./user/routes/index')
const accessRoutes = require('./user/routes/access/access.route')
const layoutAdminRoutes = require('./admin/routes');
const getAdminOrder = require('./admin/routes/order.route');
configViewEngine(app)
const registerAdminRoutes = require('./admin/routes/access.route');
const jwt = require('jsonwebtoken');

const {AccessController} = require('./user/controllers/access.controller');
// init middlewareDatabase
// routes
app.use('/', layoutRoute)
app.use('/', accessRoutes)
app.use('/', layoutAdminRoutes)
app.use('/', getAdminOrder)
app.use('/', registerAdminRoutes)

app.get('/logout', (req, res) => {
    const controller = new AccessController();
    controller.logout(req, res);
});


app.use((req, res, next) => {

    res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://fonts.gstatic.com;");
    next();
});

app.use((err, req, res, next) => {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error message
});
//handle error


module.exports = app

