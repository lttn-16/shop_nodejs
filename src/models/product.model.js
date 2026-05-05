const { model, Schema, Types } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        slug: { type: String },
        thumbnail: { type: String, trim: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        category: { type: String, trim: true },
        shop: { type: Types.ObjectId, ref: "Shop" },
        attributes: { type: Schema.Types.Mixed },
        ratingAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must be at most 5"],
            set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

// Middleware to generate slug from name before saving
productSchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
});

module.exports = model(DOCUMENT_NAME, productSchema);
