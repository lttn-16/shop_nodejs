const { getCartById } = require("../models/repositories/cart.repo");
const { NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { applyDiscountCode } = require("../services/discount.service");

class CheckoutService {
    /* 
        cartId,
        userId,
        orderItems: [
            {
                shopId,
                shopDiscount = [],
                products: [
                    {
                        productId,
                        quantity,
                        price,
                    }
                ],
            },
            {
                shopId,
                shopDiscount = [],
                products: [
                    {
                        productId,
                        quantity,
                        price,
                    }
                ],
            },
        ]
    */
    static async checkoutReview({ cartId, userId, orderItems }) {
        const foundCart = await getCartById(cartId);
        if (!foundCart) {
            throw new NotFoundError("Cart not found");
        }
        const checkoutOrder = {
            totalPrice: 0, // tong tien hang
            totalDiscount: 0, // tong giam gia
            totalCheckout: 0, // tong thanh toan
            feeShip: 0, // phi van chuyen
        };

        const orderItemsNew = [];
        // tinh tong bill
        for (const item of orderItems) {
            const { shopId, shopDiscount = [], products } = item;
            // check san pham co ton tai hay khong
            const checkProducts = await checkProductByServer(products);
            // tinh tong tien
            const checkoutPrice = checkProducts.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0);

            const itemCheckout = {
                shopId,
                shopDiscount,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                products: checkProducts,
            };

            checkoutOrder.totalPrice += checkoutPrice;
            if (shopDiscount.length > 0) {
                const discount = shopDiscount[0]; // chi ap dung 1 ma giam gia cho 1 don hang
                const { discount_amount = 0 } =
                    await applyDiscountCode({
                        code: discount.code,
                        user_id: userId,
                        shop_id: shopId,
                        products: checkProducts,
                    });
                // tong giam gia
                checkoutOrder.totalDiscount += discount_amount;
                if (discount_amount > 0) {
                    itemCheckout.priceApplyDiscount =
                        checkoutPrice - discount_amount;
                }
            }
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
            orderItemsNew.push(itemCheckout)
        }
        return {
            orderItems,
            orderItemsNew,
            checkoutOrder,
        }
    }
}

module.exports = CheckoutService
