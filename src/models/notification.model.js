const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const notificationSchema = new Schema(
    {
        noti_senderId: {
            type: String,
            required: true,
        }, // Người thực hiện hành động
        noti_receiverId: {
            type: String,
            required: true,
        }, // Người nhận thông báo
        noti_type: {
            type: String,
            enum: ["PRODUCT", "COMMENT", "SYSTEM"],
            required: true,
        },
        noti_content: { type: String, required: true },
        noti_isRead: { type: Boolean, default: false },
        noti_isDeleted: { type: Boolean, default: false },
        // Metadata bổ sung nếu cần (ví dụ: link ảnh sản phẩm, tiêu đề bài viết)
        noti_options: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
