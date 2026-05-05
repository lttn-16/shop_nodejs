const inventoryModel = require("../inventory.model");

const insertInventory = async ({ product_id, shop_id, stock, location = "unknown" }) => {
    return await inventoryModel.create({ product_id, shop_id, stock, location });
}

module.exports = {
    insertInventory,
}