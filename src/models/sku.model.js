const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Sku'
const COLLECTION_NAME = 'skus'

const skuSchema = new Schema({
    sku_id: { type: String, required: true, unique: true }, // string "{spu_id}123346-{shop_id}"
    sku_tier_idx: { type: Array, default: [0] }, // [1,0], [1,1]

    /*
        color = [red, green] = [0, 1]
        size = [S, M] = [0, 1]

        => red + S = [0, 0]
           red + M = [0, 1]
    */

    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: '' },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: String, required: true },
    sku_stock: { type: Number, default: 0 }, // array in of stock
    product_id: { type: String, required: true }, // ref to spu product

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, skuSchema)