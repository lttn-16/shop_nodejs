const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
    {
        product_id: { type: Types.ObjectId, ref: "Product", required: true },
        shop_id: { type: Types.ObjectId, ref: "Shop", required: true },
        stock: { type: Number, required: true },
        location: { type: String },
        reservations: { type: Array, default: [] }, 
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
