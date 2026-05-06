const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema({
    cart_state : { type: String, enum: ["active", "completed", "failed", "pending"], default: "active" },
    cart_user_id: { type: String, required: true },
    cart_count_product: { type: Number, default: 0 },
    cart_items: { type: Array, default: [] }, // Mảng chứa thông tin sản phẩm trong giỏ hàng
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, cartSchema);