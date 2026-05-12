const redis = require('redis');
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
        console.log(`connectionRedis - Connection status: connected`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`);
        // connect retry
        handleTimeoutError();
    });

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnecting`);
        clearTimeout(connectionTimeout);
    });

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: error ${err}`);
        // connect retry
        handleTimeoutError();
    });
};

const initRedis = async () => {
    const instanceRedis = redis.createClient();
    client.instanceConnect = instanceRedis;
    handleEventConnection({
        connectionRedis: instanceRedis
    });
    await instanceRedis.connect();
};

const getRedis = () => client;

const closeRedis = () => {
    const { instanceConnect } = client;
    if (instanceConnect) {
        // 1. Hủy bỏ timeout đang chờ (nếu có) để tránh throw error sau khi đã đóng
        if (connectionTimeout) {
            clearTimeout(connectionTimeout);
        }

        // 2. Đóng kết nối
        instanceConnect.quit((err, res) => {
            if (err) {
                console.error('Error closing Redis connection:', err);
            } else {
                console.log('Redis connection closed gracefully');
            }
        });
    }
};

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
};