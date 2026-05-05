const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth");
const { findByEmail } = require("./shop.service");
const {
    BadRequestError,
    ConflictRequestError,
    UnauthorizedError,
    ForbiddenError,
} = require("../core/error.response");


const ROLE_SHOP = {
    SHOP: "shop",
    ADMIN: "admin",
    WRITER: "writer",
    EDITOR: "editor",
};

class AccessService {
    static handleRefreshToken = async ({ refreshToken }) => {
        // check token đã được sử dụng chưa
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        // nếu rồi
        if(foundToken) {
            // decode xem là ai
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log({ userId, email })
            // xoá tất cả token trong key store
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError("Refresh token reuse detected");
        }
        // neu chưa
        const keyStore = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!keyStore) {
            throw new UnauthorizedError("Refresh token not found");
        }
        const { userId, email } = await verifyJWT(refreshToken, keyStore.privateKey);
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new UnauthorizedError("Shop not found");
        }
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey,
        );
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user: { userId, email },
            tokens,
        };
    }

    static logout = async ( keyStore ) => {
        return await KeyTokenService.removeKeyById(keyStore._id);
    }

    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await shopModel.findOne({ email }).lean();
        if (!foundShop) {
            throw new UnauthorizedError("Shop not found");
        }
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new UnauthorizedError("Invalid password");
        }
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey,
        );
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });
        return {
            shop: {
                _id: foundShop._id,
                email: foundShop.email,
                name: foundShop.name,
            },
            tokens: {
                ...tokens,
            },
        };
    };

    static signUp = async ({ name, email, password }) => {
        const isExist = await shopModel.findOne({ email }).lean();
        if (isExist) {
            throw new ConflictRequestError("Shop already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: hashedPassword,
            roles: [ROLE_SHOP.SHOP],
        });
        if (newShop) {
            // create public secret and private secret
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey,
            );

            const publicKeySaved = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken,
            });
            if (!publicKeySaved) {
                throw new BadRequestError("Error creating key token");
            }
            return {
                shop: {
                    _id: newShop._id,
                    email: newShop.email,
                    name: newShop.name,
                },
                tokens: {
                    ...tokens,
                },
            };
        }
    };
}

module.exports = AccessService;
