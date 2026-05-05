const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
    create = async (req, res, next) => {
        return new SuccessResponse({
            message: "Product created successfully",
            metadata: await ProductService.create(req.body),
        }).send(res);
    };
    update = async (req, res, next) => {
        return new SuccessResponse({
            message: "Product updated successfully",
            metadata: await ProductService.update(req.params.id, req.body),
        }).send(res);
    }
}

module.exports = new ProductController();
