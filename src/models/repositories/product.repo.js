"use strict";
 const {product, electronic, furniture, clothing} = require('../../models/product.model')
 const {Types} = require('mongoose')
const findAllDraftForShop = async ({query, limit, skip})=> {
    return await queryProduct({query, limit,skip})
}

const findAllPublishForShop = async ({query, limit, skip}) =>{
     return await queryProduct({query, limit,skip})
}


/** Shop Owner
 * Publish 1 product by a shop
 * modifiedCount
 * update thành công = 1
 * no update = 0
 */
const publishProductByShop = async ({product_shop, product_id}) =>{
     const foundShop = await product.findOne({
         product_shop: new Types.ObjectId(product_shop),
         _id: new Types.ObjectId(product_id)
     })
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}
/** Shop Owner
 * Để unpublish thì khá đơn giản, chuyển trạng thái là được
 * @param {boolean} isDraft = true
 * @param {boolean} isPublished = false
 * @returns {Promise<void>}
 */
const unPublishProductByShop = async ({product_shop, product_id}) =>{
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false

    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount
}


/** searchProductByUser
 *
 * @param keySearch
 */
const searchProductByUser = async ({ keySearch }) => {
    try {
        // Assuming keySearch is a text search string for MongoDB's $text search.
        return await product.find(
            { $text: { $search: keySearch }, isPublished:true },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .lean();
    } catch (error) {
        console.error('Error searching products:', error);
        throw error; // or handle it in another way
    }
};



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
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser
}