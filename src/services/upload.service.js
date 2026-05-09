const cloudinary = require("../configs/cloudinary.config");
const { createRandomString } = require("../utils");
const { s3, PutObjectCommand } = require('../configs/s3.config')

class UploadService {
    // upload file use s3
    static async uploadImageToS3({ file }) {
        try {
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: createRandomString(5),
                Body: file.buffer,
                ContentType: 'image/jpeg'
            })
            const result = await s3.send(command)
            return result
        } catch (e) {
            console.error("uploadImageFromLocalS3 Error::", e);
            throw e
        }
    }

    static async uploadImageFromUrl() {
        try {
            const url =
                "https://bizweb.dktcdn.net/100/467/909/products/460611327-8184121571656261-53008.jpg?v=1733895095210";
            const folderName = "shopdev",
                newFileName = "twinke";
            const result = await cloudinary.uploader.upload(url, {
                public_id: newFileName,
                folder: folderName,
            });
            return result;
        } catch (e) {
            console.error("uploadImageFromUrl Error::", e);
        }
    }

    // upload 1 image
    static async uploadImageFromLocal({ path, folderName = "shopdev" }) {
        try {
            const result = await cloudinary.uploader.upload(path, {
                public_id: createRandomString(5),
                folder: folderName,
            });
            return {
                ...result,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: "jpg",
                }),
            };
        } catch (e) {
            console.error("uploadImageFromUrl Error::", e);
        }
    }

    // upload nhieu image
    static async uploadImageFromLocalFiles({ files, folderName = "shopdev" }) {
        try {
            if (!files.length) return;
            const uploadUrls = [];
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: folderName,
                });
                uploadUrls.push({
                    ...result,
                    // resize image
                    thumb_url: await cloudinary.url(result.public_id, {
                        height: 100,
                        width: 100,
                        format: "jpg",
                    }),
                });
            }
            return uploadUrls;
        } catch (e) {
            console.error("uploadImageFromLocalFiles Error::", e);
        }
    }
}

module.exports = UploadService;
