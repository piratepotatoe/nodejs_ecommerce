"use strict";
 const {product, electronic, furniture, clothing} = require('../../models/product.model')
 const {Types} = require('mongoose')
const findAllDraftForShop = async ({query, limit, skip})=> {
    return await queryProduct({query, limit,skip})
}

const findAllPublishForShop = async ({query, limit, skip}) =>{
     return await queryProduct({query, limit,skip})
}

const publishProductByShop = async ({product_shop, product_id}) =>{
     const foundShop = await product.findOne({
         product_shop: new Types.ObjectId(product_shop),
         _id: new Types.ObjectId(product_id)
     })
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)
    /**
     * modifiedCount
     * update thành công = 1
     * no update = 0
     */
    return modifiedCount
}
const queryProduct = async ({query, limit, skip})=>{
     return await product.find(query)
         .populate('product_shop', 'name email -_id')
         .sort({updateAt:-1})
         .skip(skip)
         .lean()
         .limit(limit)
         .exec()
}

module.exports = {
     findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop
}