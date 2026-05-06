const ProductModel = require("../product.model");
const { convertToObjectIdMongodb } = require("../../utils");

const getProductById = async (id) => {
    return await ProductModel.findOne({
        _id: convertToObjectIdMongodb(id),
    }).lean();
};

const checkProductByServer = async (products) => {
    return await Promise.all(
        products.map(async (product) => {
            const foundProduct = await getProductById(product.productId);
            if (!foundProduct) {
                throw new NotFoundError(
                    `Product with id ${product.productId} not found`,
                );
            }
            return {
                price: foundProduct.price,
                quantity: product?.quantity,
                productId: product.productId,
            };
        }),
    );
};

module.exports = {
    getProductById,
    checkProductByServer,
};

