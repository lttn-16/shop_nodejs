const multer = require("multer");
const { createRandomString } = require("../utils");

const uploadMemory = multer({
    storage: multer.memoryStorage(),
});

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./src/uploads/");
        },
        filename: function (req, file, cb) {
            cb(null, `${createRandomString(5)}.${file.originalname}`);
        },
    }),
});

module.exports = {
    uploadMemory,
    uploadDisk,
}
