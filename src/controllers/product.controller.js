"use strict";
const ProductService = require("../services/product.service")
const {SuccessResponse} = require("../core/success.response")

class ProductController{
    createProduct = async (req, res,next) =>{
        console.log(req.body)
        new SuccessResponse({
            message:"Successfully create new product",
            metadata: await ProductService.createProduct(req.body.product_type, req.body)
    }).send(res)
}
}
module.exports = new ProductController()