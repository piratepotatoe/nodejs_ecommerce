'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth');
const { authenticationV2} = require('../../auth/authUtils');


// Authentication
router.use(authenticationV2)
//logout
router.post('', productController.createProduct)


module.exports = router