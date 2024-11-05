const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    const __dirname = path.resolve();

    app.set('views', path.join(__dirname, 'src', 'views'));
    app.use('/public', express.static(path.join(__dirname, 'src', 'public')));

    app.set('view engine', 'ejs');
};

module.exports = configViewEngine;