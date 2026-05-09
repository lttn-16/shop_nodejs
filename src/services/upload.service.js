const cloudinary = require("../configs/cloudinary.config");
const { createRandomString, getClouldfrontUrl } = require("../utils");
const {
    s3,
    PutObjectCommand,
    GetObjectCommand,
} = require("../configs/s3.config");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

class UploadService {
    // upload file use s3
    static async uploadImageToS3({ file }) {
        try {
            const imageName = createRandomString(5);
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageName,
                Body: file.buffer,
                ContentType: "image/jpeg",
            });
            await s3.send(command);
            /* 
                // public image url s3
                const signedUrl = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: imageName,
                });
                const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 }); 
            */
            // use cloudfront url mã hoá
            const url = getSignedUrl({
                url: getClouldfrontUrl(imageName),
                keyPairId: process.env.AWS_CLOUD_FRONT_PUBLIC_KEY,
                dateLessThan: new Date(Date.now() + 60 * 1000), // hết hạn sau 60 giây
                privateKey: process.env.AWS_CLOUD_FRONT_PRIVATE_KEY,
            });

            return url;
        } catch (e) {
            console.error("uploadImageFromLocalS3 Error::", e);
            throw e;
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
