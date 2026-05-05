const AccessService = require("../services/access.service");
const { Created, SuccessResponse } = require("../core/success.response");

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        return new SuccessResponse({
            message: "Refresh token handled successfully",
            metadata: await AccessService.handleRefreshToken(req.body),
        }).send(res);
    };
    logout = async (req, res, next) => {
        console.log("Logout request: ", req.keyStore);
        return new SuccessResponse({
            message: "Logout successful",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };

    login = async (req, res, next) => {
        return new SuccessResponse({
            message: "Login successful",
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    signup = async (req, res, next) => {
        return new Created({
            message: "User signed up successfully",
            metadata: await AccessService.signUp(req.body),
        }).send(res);
    };
}

module.exports = new AccessController();
