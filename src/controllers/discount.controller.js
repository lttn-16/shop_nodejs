const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    create = async (req, res) => {
        return new SuccessResponse({
            message: "Discount code created successfully",
            metadata: await DiscountService.createDiscountCode({ ... req.body, shop_id: req.user.userId }),
        }).send(res);
    }
    applyDiscount = async (req, res) => {
        return new SuccessResponse({
            message: "Discount code applied successfully",
            metadata: await DiscountService.applyDiscountCode({ ... req.body, shop_id: req.user.userId }),
        }).send(res);
    }
    cancelDiscount = async (req, res) => {
        return new SuccessResponse({
            message: "Discount code cancelled successfully",
            metadata: await DiscountService.cancelDiscountCode({ ... req.body, shop_id: req.user.userId }),
        }).send(res);
    }
}

module.exports = new DiscountController();