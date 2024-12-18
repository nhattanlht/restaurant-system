const express = require('express')
const configViewEngine = require('./configs/engine.config')
const app = express()

const user = require('./user/routes/index')
const accessRoutes = require('./user/routes/access/access.route')
const layoutAdminRoutes = require('./admin/routes');
const getAdminOrder = require('./admin/routes/order.route');
configViewEngine(app)
const registerAdminRoutes = require('./admin/routes/access.route');
const adminRoutes = require("./admin/routes/admin.route");
const {authenticate} = require('./shared/middleware/auth.middleware');
const {AccessController} = require('./user/controllers/access.controller');
const methodOverride = require("method-override");

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
    next();
});

// init middlewareDatabase
app.use(methodOverride('_method'));  // Giả lập phương thức PUT thông qua trường _method

// routes
app.use(user)
app.use('/admin', adminRoutes)

// app.use('/', layoutAdminRoutes)

const helmet = require('helmet');
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Default to same-origin
      scriptSrc: ["'self'", "https://unpkg.com", "'unsafe-inline'"], // Allow scripts from unpkg
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"], // Allow stylesheets
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow fonts
      imgSrc: ["'self'", "data:"], // Allow images
      connectSrc: ["'self'"], // Allow AJAX/WebSocket connections
      scriptSrcElem: ["'self'", "https://unpkg.com"],
      styleSrcElem: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
    },
  })
);

// app.use('/', getAdminOrder)
// app.use('/', registerAdminRoutes)




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

// Nếu không tìm thấy route nào phù hợp
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

// Middleware xử lý lỗi
app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.status(status);
    res.render('user/error', { error: error, user: null });
});

//handle error

module.exports = app

