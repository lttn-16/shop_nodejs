const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        verified: { type: Boolean, default: false },
        roles: { type: Array, default: [] },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

module.exports = model(DOCUMENT_NAME, shopSchema);