require('dotenv').config();

const compression = require('compression');
const express = require('express');
const helmet = require('helmet'); // Corrected helmet import
const morgan = require('morgan');
const app = express();



// Initialize middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// Initialize database
require('./dbs/init.mongodb'); // Corrected the file name if it was a typo
const { checkOverload, countConnect } = require('./helpers/check.connect');
checkOverload();
countConnect();

// Initialize routers
app.use('/',require('./routers'))

// Handling errors
//middleware error
app.use ((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
// đây là function để handle error
app.use ((error, req, res, next) => {
    // return next()
    const statusCode = error.status || 500 // HTML status code
    return res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        message: error.message || 'Internal Server Error',
        e: error.statusCode
    })
})
// Example: app.use(errorHandler);

module.exports = app; // Export the Express app