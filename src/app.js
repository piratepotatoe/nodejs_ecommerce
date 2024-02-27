const compression = require('compression');
const express = require('express');
const helmet = require('helmet'); // Corrected helmet import
const morgan = require('morgan');
const app = express();

// Initialize middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Initialize database
require('./dbs/init.mongodo'); // Corrected the file name if it was a typo
const { checkOverload, countConnect } = require('./helpers/check.connect');
checkOverload();
countConnect();

// Initialize routers
app.get('/', (req, res, next) => {
    const strCompress = 'hello daring fox';
    return res.status(200).json({
        message: 'Welcome Daring Fox',
        metadata: strCompress.repeat(10000)
    });
});

// Handling errors
// Example: app.use(errorHandler);

module.exports = app; // Export the Express app