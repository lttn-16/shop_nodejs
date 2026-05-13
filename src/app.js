require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { v4: uuidv4 } = require("uuid");
const logger = require("./loggers/winston.log");
// const initRedis = require("../src/configs/redis.config")
// initRedis.initRedis().catch((err) => {
//     console.error("Redis init failed:", err);
// });
const ioRedis = require('./configs/ioredis.config')
ioRedis.init({
    IORERIS_IS_ENABLED: true
})

const elasticSearch = require('./configs/elasticsearch.config')
elasticSearch.init({
    ELASTICSEARCH_IS_ENABLED: true
})

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// log midleware
app.use((req, res, next) => {
    const requestId = req.headers["x-request-id"];
    req.requestId = requestId ? requestId : uuidv4();

    logger.log(`input params ::${req.method}::`, [
        req.path,
        { requestId: req.requestId },
        req.method === "POST" ? req.body : req.query,
    ]);

    next();
});

// init dbs
require("./dbs/init.mongodb");

// init routes
app.use("/", require("./routes/index"));

//handle error
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const resMessage = `${err.status || 500} - ${Date.now() - err.now}ms - Response: ${JSON.stringify(err)}`;
    logger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        {
            message: err.message,
        },
    ]);
    return res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        status: "error",
        code: statusCode,
        stack: err.stack,
    });
});

module.exports = app;
