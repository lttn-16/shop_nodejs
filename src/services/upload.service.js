const cloudinary = require('../configs/cloudinary.config')

class UploadService {
    static async uploadImageFromUrl(){
        try {
            const url = "https://bizweb.dktcdn.net/100/467/909/products/460611327-8184121571656261-53008.jpg?v=1733895095210"
            const folderName = "shopdev", newFileName = "twinke"
            const result = await cloudinary.uploader.upload(url, {
                public_id: newFileName,
                folder: folderName
            })
            return result
        } catch(e){
            console.error("uploadImageFromUrl Error::", e)
        }
    }
}

module.exports = UploadService