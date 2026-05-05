const productModel = require("../models/product.model");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { Types } = require("mongoose");

class ProductService {
    static create = async (payload) => {
        const newProduct = await productModel.create(payload);
        if(newProduct) {
            await insertInventory({
                product_id: new Types.ObjectId(newProduct._id),
                shop_id: new Types.ObjectId(payload.shop_id),
                stock: payload.quantity,
            });
        }
        return newProduct;
    }
    static update = async (id, payload) => {
        const objParams = removeUndefinedObject(payload);
        return productModel.findByIdAndUpdate(id, updateNestedObjectParser(objParams), { new: true });
    }
}

module.exports = ProductService;