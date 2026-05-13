const { model, Schema, Types } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
    {
        product_name: { type: String, required: true }, // quan jean cao cap
        product_thumb: { type: String, required: true },
        product_description: String, //
        product_slug: String, // quan-jean-cao-cap-01
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        // product_type: {
        //     type: String,
        //     required: true,
        //     enum: ["Electronics", "Clothing", "Furniture"],
        // },
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        product_attributes: { type: Schema.Types.Mixed, required: true },
        // more
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be above 5.0"],
            // 4.345666 => 4.3
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: { type: Array, default: [] },
        /*
            tier_variation: [
                {
                    images: [],
                    name: 'color',
                    options: ['red', 'green'],
                },
                {
                    images: [],
                    name: 'size',
                    options: ['S', 'M'],
                }
            ]
        */
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    },
);

// Middleware to generate slug from name before saving
productSchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
});

module.exports = model(DOCUMENT_NAME, productSchema);
