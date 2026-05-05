const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init dbs
require('./dbs/init.mongodb');

// init routes
app.use('/', require('./routes/index'));

//handle error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        status: 'error',
        code: statusCode,
    });
});

module.exports = app;