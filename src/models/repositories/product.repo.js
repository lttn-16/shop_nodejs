const ProductModel = require("../product.model");
const { convertToObjectIdMongodb } = require("../../utils");

const getProductById = async (id) => {
    return await ProductModel.findOne({ _id: convertToObjectIdMongodb(id) }).lean();
}

module.exports = {
    getProductById,
}