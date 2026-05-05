const productModel = require("../models/product.model");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

class ProductService {
    static create = async (payload) => {
        return productModel.create(payload);
    }
    static update = async (id, payload) => {
        const objParams = removeUndefinedObject(payload);
        return productModel.findByIdAndUpdate(id, updateNestedObjectParser(objParams), { new: true });
    }
}

module.exports = ProductService;