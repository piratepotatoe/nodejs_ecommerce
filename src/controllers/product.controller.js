"use strict";
const ProductService = require("../services/product.service")
const {SuccessResponse} = require("../core/success.response")
const ProductServiceV2 = require("../services/product.service.rework")
class ProductController{
    /**
     * @desc Tạo product
     * @param {String} product_type lấy product và sau đó sẽ tạo documents theo product type
     * @param {String} product_shop chính là shop - đảm bảo product shop
     * @param next
     * @returns {JSON}
     */
    createProduct = async (req, res,next) =>{
        console.log("user id req body", req.user)
        console.log(`Product type`, req.body.product_type)
        // new SuccessResponse({
        //     message: "Successfully create new product",
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     }).send(res)

            new SuccessResponse({
                message:'Create new Product Success',
                metadata: await ProductServiceV2.createProduct(req.body.product_type,{
                    ...req.body,
                    product_shop: req.user.userId
                })
            }).send(res)

    }
    /**
     *
     * @desc Get all Draft for shop
     * @param {Number} limit
     * @param {Number} skip
     * @param next
     * @returns {JSON}
     */
    getAllDraftsForShop = async (req, res, next) =>{
        new SuccessResponse({
            message:'Get List Draft Success!',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

}
module.exports = new ProductController()