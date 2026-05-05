const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, accessSecret, refreshSecret) => {
    try {
        const accessToken = await JWT.sign(payload, accessSecret, {
            expiresIn: "2 days",
        });
        const refreshToken = await JWT.sign(payload, refreshSecret, {
            expiresIn: "7 days",
        });
        JWT.verify(accessToken, accessSecret, (err, decode) => {
            if (err) {
                console.log("Error verify token: ", err);
            } else {
                console.log("Decode token: ", decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new UnauthorizedError("Invalid client id");
    }
    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError("Key store not found");
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new UnauthorizedError("Invalid access token");
    }
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) {
            throw new UnauthorizedError("Invalid user");
        }
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        console.log(error);
        throw error;
    }
});

const verifyJWT = async (token, secretKey) => {
    return await JWT.verify(token, secretKey);
};

module.exports = { createTokenPair, authentication, verifyJWT };
