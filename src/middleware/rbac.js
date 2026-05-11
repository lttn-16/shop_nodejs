const ac = require("./role.middleware");

/**
 * @param {string} action - Ví dụ: 'readAny', 'updateOwn', 'deleteAny'
 * @param {string} resource - Ví dụ: 'product', 'order'
 */

/**
 * [PHÂN QUYỀN FLOW - ACCESS CONTROL]
 * 
 * 1. Request đến: GET /v1/api/profile/view-any
 * 
 * 2. Chặn lại: Middleware grantAccess("readAny", "profile") kích hoạt.
 * 
 * 3. Nhận diện: 
 *    - Middleware soi vào `req.user` (đã được gán từ tầng Authentication trước đó).
 *    - Xác định Role (Ví dụ: role = 'admin').
 * 
 * 4. Tra cứu (Lookup):
 *    - Đối chiếu với `grantList` (Bộ quy tắc tổng):
 *    - Câu hỏi: "Admin" + "readAny" + "profile" => CÓ trong danh sách không?
 * 
 * 5. Quyết định (Verdict):
 *    - CÓ (Granted): Next() -> Cho phép vào Controller xử lý tiếp.
 *    - KHÔNG (Denied): Trả về 403 Forbidden - "Nghỉ chơi, không đủ quyền!".
 */

const grantAccess = (action, resource) => {
    return (req, res, next) => {
        try {
            /* 
                1. tạo resource và role data
                2. viết api getRoleList trả về đúng cấu trúc như { role: 'admin', resource: 'profile', action: 'read:any', attributes: '*, !views' },
                3. tại đây, lấy data roleList và kiểm tra quyền
                ac.setGrants(await getRoleList())
            */
            // Giả sử req.user.role đã được gán từ middleware authentication trước đó
            const userRole = req.query.role;

            // Kiểm tra quyền
            const permission = ac.can(userRole)[action](resource);

            if (!permission.granted) {
                return res.status(403).json({
                    status: "error",
                    message:
                        "You don't have enough permissions to perform this action",
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    grantAccess,
};
