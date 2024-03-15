'use strict';

const shopModel = require("../models/shop.model");

// Step 1: tìm email mà user đã điền vào trong hệ thống, check xem có tồn tại không
const findByEmail = async ({email, select = {
    email:1, password:2, name:1, status:1, roles:1
}}) => {
    return await shopModel.findOne({ email }).select(select).lean()
}

module.exports = {
    findByEmail
}