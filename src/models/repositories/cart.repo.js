const { convertToObjectIdMongodb } = require("../../utils");
const CartModel = require("../cart.model");

const getCartById = async (id) => {
    return await CartModel.findOne({ _id: convertToObjectIdMongodb(id) }).lean();
}

module.exports = {
    getCartById,
}