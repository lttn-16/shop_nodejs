const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_code: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        discount_type: { type: String, enum: ["percentage", "fixed_amount"], default: "fixed_amount" },
        discount_value: { type: Number, required: true },
        discount_start_date: { type: Date, required: true },
        discount_end_date: { type: Date, required: true },
        usage_limit: { type: Number, default: 1 }, // Số lượng max được sử dụng
        used_count: { type: Number, default: 0 }, // Số lượng đã được sử dụng
        used_by: { type: Array, default: [] }, // Người dùng mã giảm giá
        discount_max_per_user: { type: Number, default: 1 }, // Số lượng max mỗi người dùng được sử dụng
        discount_min_order_value: { type: Number, default: 0 }, // Giá trị đơn hàng tối thiểu để áp dụng mã giảm giá
        discount_shop_id: { type: Types.ObjectId, ref: "Shop", required: true }, // ID cửa hàng áp dụng mã giảm giá
        discount_status: { type: Boolean, default: true }, // Trạng thái mã giảm giá
        discount_applies_to: { type: String, enum: ["all", "specific"], default: "all" }, // Áp dụng cho tất cả sản phẩm hay chỉ sản phẩm cụ thể
        discount_product_ids: [{ type: Types.ObjectId, ref: "Product" }], // Danh sách ID sản phẩm nếu áp dụng cho sản phẩm cụ thể
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, discountSchema);
