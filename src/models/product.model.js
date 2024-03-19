'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products'
const slugify = require('slugify')
const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, required: true },
    //more
    product_ratingAverage:{
        type: Number,
        default: 4.5,
        min: [1,'Rating must be above 1'],
        max: [5, 'Rating must be below 5'],
        //4.33333342343 => 4.3
        set: (val) => Math.round(val *10)/10
    },
    product_variation: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
        isPublished: {type: Boolean, default: false, index: true, select: false}
},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
)

// Document middleware: runs before .save() and .create()...
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, {lower:true})
    next()
})


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
    color: String,
    product_shop:{type: Schema.Types.ObjectId, ref:'Shop'}

}, {
    collection: 'electronics',
    timestamps: true
})


const furnitureSchema = new Schema({
    manufacturer: {type:String, required:true},
    model: String,
    color:String,
    product_shop:{type:Schema.Types.ObjectId, ref:'Shop'}
},
    {collection: 'furnitures',
        timestamps: true
    })


module.exports = {
    product:model(DOCUMENT_NAME,productSchema),
    clothing:model('Clothes',clothingSchema),
    electronic:model('Electronic',electronicSchema),
    furniture: model('Furniture', furnitureSchema)
}