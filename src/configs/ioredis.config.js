const Redis = require('ioredis');
const { RedisErrorRespnse } = require('../core/error.response');

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}, connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Redis loi roi anh em oi',
        en: 'Service connection error'
    }
};

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorRespnse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        });
    }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({
    connectionRedis
}) => {
    // Check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionIoRedis - Connection status: connected`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionIoRedis - Connection status: disconnected`);
        // connect retry
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionIoRedis - Connection status: reconnecting`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionIoRedis - Connection status: error ${err}`);
        // connect retry
        handleTimeoutError();
    });
};

const init = ({
    IORERIS_IS_ENABLED,
    IOREDIS_HOSTS = process.env.REDIS_CACHE_HOST,
    IOREDIS_PORT = 6379
}) => {
    if(IORERIS_IS_ENABLED){
        const instanceRedis = new Redis({
            host: IOREDIS_HOSTS,
            port: IOREDIS_PORT
        })
        client.instanceConnect = instanceRedis
        handleEventConnection({
            connectionRedis: instanceRedis
        })
    }
}

const getIORedis = () => client

// triển khai code closeIORedis như sau:
const closeIORedis = () => {
    if (client.instanceConnect) {
        client.instanceConnect.quit()
    }
}

module.exports = {
    init,
    getIORedis,
    closeIORedis
}

