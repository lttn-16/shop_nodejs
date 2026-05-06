const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "HCM",
    }) {
        const product = await getProductById(productId);
        if (!product) throw NotFoundError("product not found");
        const query = {
            shop_id: shopId,
            product_id: productId,
        };
        const updateSet = {
            $inc: {
                stock,
            },
            $set: {
                location: location,
            },
        };
        const options = {
            new: true,
            upsert: true,
        };
        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService
