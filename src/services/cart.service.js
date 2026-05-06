const CartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");

class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_user_id: userId, cart_state: "active" };
        const updateOrInsert = {
            $addToSet: { cart_items: product },
            $inc: { cart_count_product: 1 },
        };
        const options = { upsert: true, new: true };
        return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQty({ userId, product }) {
        const { quantity, product_id } = product;
        const query = {
            cart_user_id: userId,
            cart_state: "active",
            "cart_items.product_id": product_id,
        };
        const updateSet = {
            $inc: { "cart_items.$.quantity": quantity },
        };
        const options = { new: true };
        return await CartModel.findOneAndUpdate(query, updateSet, options);
    }

    static async addToCart({ userId, product = {} }) {
        const { product_id, quantity } = product;

        // 1. Tìm giỏ hàng của user
        const cart = await CartModel.findOne({
            cart_user_id: userId,
            cart_state: "active",
        });

        // 2. Nếu chưa có giỏ hàng -> Tạo mới
        if (!cart) {
            return await this.createUserCart({ userId, product });
        }

        // 3. Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const hasProduct = cart.cart_items.find(
            (item) => item.product_id === product_id,
        );

        if (hasProduct) {
            // Nếu ĐÃ CÓ: Cập nhật số lượng 
            return await this.updateUserCartQty({ userId, product });
        } else {
            // Nếu CHƯA CÓ: Push sản phẩm mới vào mảng cart_items
            return await CartModel.findOneAndUpdate(
                { cart_user_id: userId, cart_state: "active" },
                {
                    $push: { cart_items: product },
                    $inc: { cart_count_product: 1 },
                },
                { new: true, upsert: true },
            );
        }
    }

    // update cart
    static async updateCart({ userId, product }) {
        const { quantity, product_id, old_value } = product;
        const foundProduct = await getProductById(product_id);
        if (!foundProduct) throw new NotFoundError("Product not found");
        if (quantity === 0) {
            return await this.deleteCart({ userId, productId: product_id });
        }
        return await this.updateUserCartQty({
            userId,
            product: { quantity: quantity - old_value, product_id },
        });
    }

    static async deleteCart({ userId, productId }) {
        return await CartModel.findOneAndUpdate(
            { cart_user_id: userId, cart_state: "active" },
            {
                $pull: { cart_items: { product_id: productId } },
                $inc: { cart_count_product: -1 },
            },
            { new: true },
        );
    }

    static async getCartByUserId({ userId }) {
        const cart = await CartModel.findOne({
            cart_user_id: userId,
            cart_state: "active",
        }).lean();
        if (!cart) return null;
        return cart;
    }
}

module.exports = CartService;
