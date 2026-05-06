const { getCartById } = require("../models/repositories/cart.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { applyDiscountCode } = require("../services/discount.service");
const { acquireLock, releaseLock } = require("../services/redis.service")
const orderModel = require("../models/order.model")

class CheckoutService {
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
                const { discount_amount = 0 } = await applyDiscountCode({
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
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
            orderItemsNew.push(itemCheckout);
        }
        return {
            orderItems,
            orderItemsNew,
            checkoutOrder,
        };
    }

    static async orderByUser({ orderItems, cartId, userId, userAddress, userPayment }) {
        const { orderItemsNew, checkoutOrder } = await this.checkoutReview({
            orderItems,
            cartId,
            userId,
        });
        const products = orderItemsNew.flatMap(el => el.products)
        console.log("products [1]", products)
        const acquireProduct = [] 
        for(const item of products){
            const { productId, quantity } = item
            const keyLock = await acquireLock(productId, cartId, quantity)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }
        // check neu có 1 sản phẩm hết hàng trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError("Some product out of stock")
        }

        const newOrder = await orderModel.create({
            order_user_id: userId,
            order_checkout: checkoutOrder,
            order_shipping: userAddress,
            order_payment: userPayment,
            order_products: orderItemsNew
        })

        return newOrder
    }
}

module.exports = CheckoutService;
