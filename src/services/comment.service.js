const CommentModel = require("../models/comment.model");

class CommentService {
    // 1. CREATE COMMENT
    static async createComment({
        productId,
        userId,
        content,
        parentId = null,
    }) {
        const comment = new CommentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentId,
        });

        if (parentId) {
            // Tìm comment cha để lấy path của nó
            const parentComment = await CommentModel.findById(parentId);
            if (!parentComment) throw new Error("Parent comment not found");

            // Path của con = Path của cha + ID của cha
            comment.comment_path = parentComment.comment_path
                ? `${parentComment.comment_path}/${parentId}`
                : `${parentId}`;
        } else {
            // Root comment: path để trống
            comment.comment_path = "";
        }

        return await comment.save();
    }

    // 2. GET COMMENTS (Lấy cây comment cho một sản phẩm)
    static async getCommentsByParentId({
        productId,
        parentId = null,
        limit = 50,
        offset = 0,
    }) {
        const query = { comment_productId: productId };

        if (parentId) {
            // Lấy các comment con trực tiếp của parentId
            query.comment_parentId = parentId;
        } else {
            // Lấy các comment gốc (root)
            query.comment_parentId = null;
        }

        return await CommentModel.find(query)
            .sort({ createdAt: 1 })
            .skip(offset)
            .limit(limit);
    }

    // 3. GET FULL THREAD (Lấy toàn bộ nhánh con của một comment bất kỳ)
    static async getFullThread(commentId) {
        const comment = await CommentModel.findById(commentId);
        if (!comment) return [];

        // Dùng Regex để tìm tất cả comment có path chứa commentId này
        // Ví dụ: tìm các path bắt đầu bằng "parentId/commentId" hoặc chính là "commentId"
        const pathRegex = new RegExp(
            `^${comment.comment_path ? comment.comment_path + "/" : ""}${commentId}`,
        );

        return await CommentModel.find({
            comment_path: { $regex: pathRegex },
        }).sort({ comment_path: 1 });
    }

    // 4. UPDATE COMMENT
    static async updateComment({ commentId, content }) {
        return await CommentModel.findByIdAndUpdate(
            commentId,
            {
                comment_content: content,
            },
            { new: true },
        );
    }

    // 5. DELETE COMMENT (Xóa comment và tất cả con cháu của nó)
    static async deleteComment({ commentId, productId }) {
        const comment = await CommentModel.findById(commentId);
        if (!comment) throw new Error("Comment not found");

        // Tìm tất cả con cháu dựa trên path
        const pathRegex = new RegExp(
            `^${comment.comment_path ? comment.comment_path + "/" : ""}${commentId}`,
        );

        // Xóa chính nó và các con cháu
        return await CommentModel.deleteMany({
            comment_productId: productId,
            $or: [{ _id: commentId }, { comment_path: { $regex: pathRegex } }],
        });
    }

    static async getNestedComments(commentId) {
        // 1. Lấy toàn bộ con cháu (phẳng)
        const flatComments = await this.getFullThread(commentId);

        // 2. Chuyển đổi thành cấu trúc cây
        return listToTree(flatComments, commentId);
    }

    static async getWholeFamilyTree(commentId) {
        // 1. Tìm comment hiện tại (B) để lấy path
        const currentComment = await CommentModel.findById(commentId);
        if (!currentComment) throw new Error("Comment not found");

        const { comment_path, comment_productId } = currentComment;

        // 2. Phân tách path để lấy danh sách ID của các tổ tiên (A)
        // Ví dụ: path là "ID_A/ID_B" -> danh sách [ID_A, ID_B]
        const ancestorIds = comment_path ? comment_path.split("/") : [];

        // 3. Tạo Regex để tìm hậu duệ (C)
        const descendantRegex = new RegExp(
            `^${comment_path ? comment_path + "/" : ""}${commentId}`,
        );

        // 4. Thực hiện truy vấn gộp
        return await CommentModel.find({
            comment_productId: comment_productId,
            $or: [
                { _id: { $in: [...ancestorIds, commentId] } }, // Lấy tổ tiên (A) và chính nó (B)
                { comment_path: { $regex: descendantRegex } }, // Lấy hậu duệ (C)
            ],
        }).sort({ comment_path: 1, createdAt: 1 });
    }
}

module.exports = CommentService;
