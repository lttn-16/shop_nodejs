const {
    reservationInventory,
} = require("../models/repositories/inventory.repo");

const { getRedis } = require("../configs/redis.config");
const { v4: uuidv4 } = require("uuid");

const acquireLock = async (productId, cartId, quantity) => {
    const redisClient = getRedis().instanceConnect;
    const key = `lock_${productId}`;
    const retryTimes = 10; // Thử lại tối đa 10 lần
    const expireTime = 3000; // Khóa có hiệu lực trong 3 giây

    // Tạo một value duy nhất cho request này (ví dụ: lock_cart123_uuid)
    const uniqueValue = `lock_${cartId}_${uuidv4()}`;

    for (let i = 0; i < retryTimes; i++) {
        // Cố gắng chiếm khóa với giá trị duy nhất
        const result = await redisClient.set(key, uniqueValue, {
            NX: true,
            PX: expireTime,
        });
        console.log("result", result);
        if (result === "OK") {
            // Đã lấy được khóa thành công -> Tiến hành giữ hàng trong DB
            const isReserve = await reservationInventory({
                product_id: productId,
                quantity,
                cart_id: cartId,
            });
            // Nếu DB cập nhật số lượng thành công (modifiedCount > 0)
            if (isReserve && isReserve.modifiedCount > 0) {
                return {
                    key,
                    value: uniqueValue,
                    productId,
                    quantity,
                };
            }
            // Nếu giữ kho thất bại (hết hàng), chủ động xóa khóa ngay lập tức để người khác vào
            await releaseLock(key, uniqueValue);
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
    return null;
};

const releaseLock = async (key, value) => {
    const redisClient = getRedis().instanceConnect;
    // Đoạn script Lua này dịch là: Nếu giá trị của key bằng value truyền vào thì mới xóa key
    const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
    `;
    return await redisClient.eval(script, 1, key, value);
};

module.exports = {
    releaseLock,
    acquireLock,
};
