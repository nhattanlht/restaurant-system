const path = require('path');
const express = require('express');
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const configViewEngine = (app) => {
    const __dirname = path.resolve();

    // set folder static file
    app.set('views', path.join(__dirname, 'src', 'views'));
    app.use('/public', express.static(path.join(__dirname, 'src', 'public')));

    // set engine for FE
    app.set('view engine', 'ejs');

    // BE middlewares
    app.use(morgan('tiny'));
    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    app.use(session({
        secret: process.env.SESSION_SECRET,  // Khóa bí mật lưu trong .env
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // Cookie tồn tại 1 ngày
        },  // Chỉ đặt secure: true khi có HTTPS
    }));
};

module.exports = configViewEngine;
