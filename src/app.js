const express = require('express')
const configViewEngine = require('./configs/config.engine')
const layoutRoute = require('./routes/layout.route')
const app = express()

configViewEngine(app)



// init middleware

//init db
require('./db/init.mssql')

// routes
app.use('/', layoutRoute)
//handle error


module.exports = app