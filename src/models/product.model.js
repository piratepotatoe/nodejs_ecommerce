'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, required: true }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
)


//define the product type
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String, //Section 11: fix 1 size trước, các section sau sẽ update nhiều size
    material: String

}, {
    collection: 'clothes',
    timestamps: true
})


//define the product type = Electronics product
const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String, //Section 11: fix 1 size trước, các section sau sẽ update nhiều size
    color: String

}, {
    collection: 'electronics',
    timestamps: true
})

module.exports = {
    product:model(DOCUMENT_NAME,productSchema),
    clothing:model('Clothes',clothingSchema),
    electronic:model('Electronic',electronicSchema),
}