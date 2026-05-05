const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // const tokens = await keyTokenModel.create({ user: userId, publicKey, privateKey });
            // return tokens ? tokens.publicKey : null;

            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshToken,
                    refreshTokensUsed: [],
                },
                options = { upsert: true, new: true };
            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options,
            );
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    static findByUserId = async (userId) => {
        return await keyTokenModel
            .findOne({ user: new Types.ObjectId(userId) })
    };

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id });
    };

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    };

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    };

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteOne({ user: userId });
    };
}

module.exports = KeyTokenService;
