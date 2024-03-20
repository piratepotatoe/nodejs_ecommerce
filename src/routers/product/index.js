'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2 } = require('../../auth/authUtils');

/*
1. viết phần search ở bên trên để tránh việc phải chạy qua authentication
 */
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

// Authentication
router.use(authenticationV2)
//logout
router.post('',asyncHandler(productController.createProduct))
router.post('/publish/:id',asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id',asyncHandler(productController.unPublishProductByShop))

/// QUERY ///
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedByShop))

module.exports = router