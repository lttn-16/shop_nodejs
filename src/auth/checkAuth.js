const { findById } = require("../services/apiKey.service");

/* 
    Giả sử app sẽ public api cho các đối tác
    Nên sẽ có 1 api key để kiểm tra quyền truy cập vào api
    nếu không có api key hoặc api key không hợp lệ sẽ trả về lỗi 403 Forbidden
*/

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Forbidden",
                status: "error",
            });
        }
        // check objKey in db
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden",
                status: "error",
            });
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            status: "error",
        });
    }
};

/* 
    Kiểm tra quyền truy cập vào API
*/

const permissions = (permission) => {
    return (req, res, next) => {
        try {
            const objKey = req.objKey;
            if (!objKey.permissions.includes(permission)) {
                return res.status(403).json({
                    message: "Forbidden",
                    status: "error",
                });
            }
            const validPermissions = objKey.permissions.includes(permission);
            if (!validPermissions) {
                return res.status(403).json({
                    message: "Forbidden",
                    status: "error",
                });
            }
            return next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "error",
            });
        }
    };
};

module.exports = {
    apiKey,
    permissions,
};
