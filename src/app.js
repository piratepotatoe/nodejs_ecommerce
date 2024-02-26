const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// Initialize middlewares
// Example: app.use(middlewareFunction);
app.use(morgan("dev"))
//app.use(morgan("combined"))
app.use(helmet())
app.use(compression())




// Initialize database

require('./dbs/init.mongodo')
const { countConnect } = require('./helpers/check.connect')
countConnect()
// Example: databaseConnection();





// Initialize routers
// Example: app.use('/api', apiRouter);
app.get('/', (req, res, next) =>{
    const strCompress= 'hello daring fox'
    return res.status(200).json({
        message:'Welcome Daring Fox',
        metadata: strCompress.repeat(10000)
    })
})
// Handling errors
// Example: app.use(errorHandler);

module.exports = app; // Corrected this line
