const { SuccessResponse } = require("../core/success.response");
const UserService  = require("../services/user.service");

class UserController {
    // Đăng ký người dùng mới và gửi email xác thực
    newUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Gửi email xác thực thành công!",
            metadata: await UserService.newUser({
                email: req.body.email,
            }),
        }).send(res);
    };

    // Kiểm tra token người dùng gửi về từ Email link
    checkRegisterEmailToken = async (req, res, next) => {
        // Logic xác thực token sẽ nằm ở đây
        // Ví dụ: const result = await checkTokenService(req.query.token)
    };
}

module.exports = new UserController();
