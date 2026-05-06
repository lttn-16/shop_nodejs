const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
    review = async (req, res) => {
        return new SuccessResponse({
            message: "Checkout review successfully",
            metadata: await CheckoutService.checkoutReview(req.body),
        }).send(res);
    }
    order = async (req, res) => {
        return new SuccessResponse({
            message: "Ordered successfully",
            metadata: await CheckoutService.orderByUser(req.body),
        }).send(res);
    }
}

module.exports = new CheckoutController();