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
     * Publish 1 Product từ draft sang trạng thái publish
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    publishProductByShop = async (req, res,next) =>{
        new SuccessResponse({
            message:'Publish Product Success',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)

    }

    unPublishProductByShop = async (req,res,next) =>{
        new SuccessResponse({
            message: 'Unpublish Product success',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
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

    getAllPublishedByShop = async (req,res,next) => {
        new SuccessResponse({
            message:'Get List Published Success!',
            metadata: await ProductServiceV2.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req,res,next) => {
        console.log(req.params)
        new SuccessResponse({
            message:'Get List Search Product Success!',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res)
    }



}
module.exports = new ProductController()