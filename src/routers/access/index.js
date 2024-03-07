'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router()
const { asyncHandle } = require('../../auth/checkAuth');

//Sign up


// })
/* 
Thông thường, khi bạn có một hàm bất đồng bộ và bạn muốn sử dụng nó trong route handler hoặc middleware, 
bạn phải tự mình bắt các lỗi bất đồng bộ và gọi next(error)
để chuyển lỗi đến middleware xử lý lỗi tiếp theo. Nhưng khi bạn sử dụng asyncHandle, nó sẽ tự động bắt và chuyển lỗi cho bạn, 
làm cho mã nguồn của bạn gọn gàng và dễ đọc hơn.
*/
router.post('/shop/signup', asyncHandle(accessController.signUp))
router.post('/shop/login', asyncHandle(accessController.login))
module.exports = router