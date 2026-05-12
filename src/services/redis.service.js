const {
    reservationInventory,
} = require("../models/repositories/inventory.repo");

const { getRedis } = require("../configs/redis.config")

const acquireLock = async (productId, cartId, quantity) => {
    const redisClient = getRedis().instanceConnect;
    const key = `lock_${productId}`;
    const retryTimes = 10; // Thử lại tối đa 10 lần
    const expireTime = 3000; // Khóa có hiệu lực trong 3 giây
    for (let i = 0; i < retryTimes; i++) {
        // Tạo một giá trị duy nhất để đảm bảo chỉ người giữ khóa mới có quyền giải phóng nó
        const result = await redisClient.set(key, 'lock', {
            NX: true,
            PX: expireTime
        });
        console.log("result", result)
        if (result === 'OK') {
            // Kiểm tra inventory
            const isReserve = await reservationInventory({
                product_id: productId,
                quantity,
                cart_id: cartId,
            });
            if (isReserve.modifiedCount) {
                await redisClient.set(key, "lock", {
                    NX: true,
                    PX: expireTime,
                });
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
    return null;
};

const releaseLock = async (keyLock) => {
    if (!keyLock) return;
    const redisClient = getRedis().instanceConnect;
    // xóa key trong Redis
    return await redisClient.del(keyLock);
};

module.exports = {
    releaseLock,
    acquireLock,
};
