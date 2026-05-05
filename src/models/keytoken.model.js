const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keySchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: 'Shop', required: true },
        privateKey: { type: String, required: true },
        publicKey: { type: String, required: true },
        refreshTokensUsed: { type: Array, default: [] },
        refreshToken: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

module.exports = model(DOCUMENT_NAME, keySchema);