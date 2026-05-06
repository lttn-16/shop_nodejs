const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const ordersSchema = new Schema(
    {
        order_user_id: { type: String, required: true },
        order_checkout: { type: Object, default: {} },
        order_shipping: { type: Object, default: {} },
        order_payment: { type: Object, default: {} },
        order_products: { type: Array, required: true },
        order_tracking_number: { type: String },
        oder_status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "cancel"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, ordersSchema);
