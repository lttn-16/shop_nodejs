const UploadService = require("../services/upload.service");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response")

class UploadController {
    upload = async (req, res, next) => {
        return new SuccessResponse({
            message: "Upload successfully",
            metadata: await UploadService.uploadImageFromUrl(),
        }).send(res);
    };

    uploadProduct = async (req, res, next) => {
        const { file } = req
        if(!file){
            throw new BadRequestError("file is not valid")
        }
        return new SuccessResponse({
            message: "Upload product successfully",
            metadata: await UploadService.uploadImageFromLocal({
                path: file.path
            }),
        }).send(res);
    };

    uploadFiles = async (req, res, next) => {
        const { files } = req
        if(!files.length){
            throw new BadRequestError("file is not valid")
        }
        return new SuccessResponse({
            message: "Upload files successfully",
            metadata: await UploadService.uploadImageFromLocalFiles({
                files
            }),
        }).send(res);
    };
}

module.exports = new UploadController();
