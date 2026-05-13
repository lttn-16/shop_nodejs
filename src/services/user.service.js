const { ErrorResponse, SuccessResponse } = require("../core/success.response");
const USER = require("../models/user.model");
const { sendEmailToken } = require("../services/email.service"); // Giả định tên file service của bạn

class UserService {
    static newUser = async ({ email = null, capcha = null }) => {
        // 1. check email exists in dbs
        const user = await USER.findOne({ email }).lean();

        // 2. if exists
        if (user) {
            return new ErrorResponse({
                message: "Email already exists",
            });
        }

        // 3. send token via email user
        const result = await sendEmailToken({ email });

        return {
            token: result,
        };
    };
}

module.exports = UserService;
