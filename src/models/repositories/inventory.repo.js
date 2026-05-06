const inventoryModel = require("../inventory.model");
const { convertToObjectIdMongodb } = require("../../utils");

const insertInventory = async ({ product_id, shop_id, stock, location = "unknown" }) => {
    return await inventoryModel.create({ product_id, shop_id, stock, location });
}

const reservationInventory = async ({ product_id, quantity, cart_id }) => {
    const query = {
        product_id: convertToObjectIdMongodb(product_id),
        stock: { $gte: quantity }
    }
    const updateSet = {
        $inc: {
            stock: -quantity
        },
        $push: {
            reservations: {
                quantity, 
                cart_id,
                created_at: new Date()
            }
        }
    }
    const options = {
        new: true,
        upsert: true,
    }
    return await inventoryModel.updateOne(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory,
}