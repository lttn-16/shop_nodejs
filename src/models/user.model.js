const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
    {
        user_id: { type: Number, required: true  },
        user_name: { type: String, required: true },
        user_slug: { type: String, required: true },
        user_password: { type: String, required: true },
        user_salt: { type: String, required: true },
        user_role: { type: Schema.Types.ObjectId, ref: 'Role' },
        user_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

module.exports = model(DOCUMENT_NAME, userSchema);
