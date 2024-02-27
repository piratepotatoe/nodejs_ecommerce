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

// Initialize database
require('./dbs/init.mongodb'); // Corrected the file name if it was a typo
const { checkOverload, countConnect } = require('./helpers/check.connect');
checkOverload();
countConnect();

// Initialize routers
app.use('/',require('./routers'))

// Handling errors
// Example: app.use(errorHandler);

module.exports = app; // Export the Express app