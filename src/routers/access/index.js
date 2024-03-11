'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');


//Sign up


// })
/* 
Thông thường, khi bạn có một hàm bất đồng bộ và bạn muốn sử dụng nó trong route handler hoặc middleware, 
bạn phải tự mình bắt các lỗi bất đồng bộ và gọi next(error)
để chuyển lỗi đến middleware xử lý lỗi tiếp theo. Nhưng khi bạn sử dụng asyncHandle, nó sẽ tự động bắt và chuyển lỗi cho bạn, 
làm cho mã nguồn của bạn gọn gàng và dễ đọc hơn.
*/
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// Authentication
router.use(authentication)
//logout
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))


module.exports = router