const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

const commentSchema = new Schema({
    comment_productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    comment_userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment_content: { type: String, default: 'text' },
    comment_parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    // Materialized Path: Lưu chuỗi "id1/id2/id3"
    comment_path: { type: String, default: '' }, 
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// Đánh Index để truy vấn Path 
commentSchema.index({ comment_productId: 1, comment_path: 1 });
// Đánh index cho sản phẩm và cha để lọc comment level 1 
commentSchema.index({ comment_productId: 1, comment_parentId: 1 });

module.exports = model(DOCUMENT_NAME, commentSchema);