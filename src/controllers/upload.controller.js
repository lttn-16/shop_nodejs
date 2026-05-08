const UploadService = require("../services/upload.service");
const { SuccessResponse } = require("../core/success.response");

class UploadController {
    upload = async (req, res, next) => {
        return new SuccessResponse({
            message: "Upload successfully",
            metadata: await UploadService.uploadImageFromUrl(),
        }).send(res);
    };
}

module.exports = new UploadController();
