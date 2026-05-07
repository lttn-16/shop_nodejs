const productModel = require("../models/product.model");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { Types } = require("mongoose");
const NotificationService = require("../services/notification.service")

class ProductService {
    static create = async (payload) => {
        const newProduct = await productModel.create(payload);
        if(newProduct) {
            await insertInventory({
                product_id: new Types.ObjectId(newProduct._id),
                shop_id: new Types.ObjectId(payload.shop),
                stock: payload.quantity,
            });
            await NotificationService.pushToNotiSystem({
                noti_type: "PRODUCT",
                noti_senderId: payload.shop,
                noti_receiverId: "02",
                noti_options: {
                    product_id: newProduct._id
                }
            })
        }
        return newProduct;
    }
    static update = async (id, payload) => {
        const objParams = removeUndefinedObject(payload);
        return productModel.findByIdAndUpdate(id, updateNestedObjectParser(objParams), { new: true });
    }
}

module.exports = ProductService;