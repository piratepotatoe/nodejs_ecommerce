"use strict";


const {product,clothing,electronic, furniture} = require('../models/product.model')
const {BadRequestError} = require("../core/error.response");
const {findAllDraftForShop, publishProductByShop, findAllPublishForShop} = require("../models/repositories/product.repo");



//define Factory class to create product

class ProductFactory{
    /*
    type: có thể là clothing, electronics, vvv
    payload: là dữ liệu
     */
    static productRegistry = {}

    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef
    }


    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Product Type undefined ${type}` )
        return new productClass(payload).createProduct()
    }

    /**
     * Section 16: Get a list of seller draft
     * findAllPublishedForShop - tìm tất cả những sản phẩm đã được publish theo 1 shop
     * @param {String} product_shop
     * @param {Number} limit
     * @param {Number} skip
     * @param {boolean} isDraft là true
     * @returns {Promise<*>} tất cả những product publish theo 1 shop
     */

    static async findAllDraftsForShop({product_shop, limit = 50, skip=0}){
        const query = { product_shop, isDraft:true}
        return await findAllDraftForShop({query, limit, skip})
    }

    /**
     * findAllPublishedForShop - tìm tất cả những sản phẩm đã được publish theo 1 shop
     * @param {String} product_shop
     * @param {Number} limit
     * @param {Number} skip
     * @param {boolean} isPublished là true
     * @returns {Promise<*>} tất cả những product publish theo 1 shop
     */
    static async findAllPublishedForShop({product_shop, limit = 50, skip=0}){
        const query = { product_shop, isPublished:true}
        return await findAllPublishForShop({query, limit, skip})

    }

    /**
     * Put
     * @param {String} product_shop Chắc chắn phải là product_shop thì mới update được
     * @param {String} product_id
     */
    static async publishProductByShop({product_shop, product_id}){
       return await publishProductByShop({product_shop, product_id})
    }




    // Version 1
    // static async createProduct(type, payload){
    //     switch (type){
    //         case 'Electronic':
    //             return new Electronic(payload).createProduct()
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct()
    //         default:
    //             throw new BadRequestError(`Invalid Product Types ${type}`)
    //     }
    // }
}

//define base class
// chứa những tham số chung

/**
 * Class Product
 * @param {String} product_name
 * @param {String} product_thumb
 * @param {String} product_description
 * @param {Number} product_price
 * @param {Number} product_quantity
 * @param {String} product_type
 * @param {Schema.Types.ObjectId} product_shop
 * @param {Schema.Types.Mixed} product_attributes
 */
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
                    product_quantity ,product_type, product_shop, product_attributes }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description =product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    //create product với những thông tin default bên trên
    async createProduct(product_id){
        return await product.create({...this, _id: product_id})
    }
}

/**
 * Define sub-class Clothing extend từ Product
 * @param {String} product_name
 * @param {String} product_thumb
 * @param {String} product_description
 * @param {Number} product_price
 * @param {Number} product_quantity
 * @param {String} product_type
 * @param {Schema.Types.ObjectId} product_shop
 * @param {Schema.Types.Mixed} product_attributes
 */
class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) return new BadRequestError('create new Clothing error')

        // nếu thành công thì khởi tạo clothing
        // super ở đây chính là Product đã khai báo ở bên product model
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) return new BadRequestError('create new Product Clothing error')

        return newProduct
    }
}

class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) return new BadRequestError('create new Electronic error')

        // nếu thành công thì khởi tạo clothing
        // super ở đây chính là Product đã khai báo ở bên product model
        // truyền id vào
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) return new BadRequestError('create new Product Electronic error')

        return newProduct
    }
}


class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Fail to create new furniture')
        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Fail to create new Product Furniture Error')
        return newProduct
    }
}

// register product types

ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory
