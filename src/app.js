const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const configViewEngine = require('./configs/config.engine')
const layoutRoute = require('./routes/layout.route')
const dotenv = require('dotenv')
dotenv.config()
const app = express()



// init middleware
configViewEngine(app)
app.use(morgan('tiny'))
app.use(helmet())
app.use(compression())
app.use(express.json())
//init db
require('./db/init.mssql')
// init routes
// app.get('/', (req, res, next)=> {
//     return res.status(200).json({
//         message: 'Welcome to the shop!',
//     })
// })
app.use('/', layoutRoute)
//handle error


module.exports = app