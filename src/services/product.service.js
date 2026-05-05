const productModel = require("../models/product.model");

class ProductService {
    static create = async (payload) => {
        return productModel.create(payload);
    }
}

module.exports = ProductService;