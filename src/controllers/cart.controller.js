const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    getCart = async (req, res) => {
        return new SuccessResponse({
            message: "Get cart successfully",
            metadata: await CartService.getCartByUserId({ userId: req.user.userId }),
        }).send(res);
    }
    addToCart = async (req, res) => {
        return new SuccessResponse({
            message: "Add to cart successfully",
            metadata: await CartService.addToCart({ userId: req.user.userId, product: req.body }),
        }).send(res);
    }
    deleteCart = async (req, res) => {
        return new SuccessResponse({
            message: "Delete cart successfully",
            metadata: await CartService.deleteCart({ userId: req.user.userId, productId: req.body.productId }),
        }).send(res);
    }
    updateCart = async (req, res) => {
        return new SuccessResponse({
            message: "Update cart successfully",
            metadata: await CartService.updateCart({ userId: req.user.userId, product: req.body }),
        }).send(res);
    }
}

module.exports = new CartController();