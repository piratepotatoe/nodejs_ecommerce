'use strict';

const { request } = require("express");
const { findById } = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()

        if (!key) {
            return res.status(403).json({
                message: 'Key Forbidden error'
            })
        }
        // check objectKey
        console.log('object', key);
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Objectkey Forbidden error'
            })
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        console.error(error.message)
    }
}
//check permissions
const permission = (permission) => {
    return (req, res, next) => {
        //permissions phải có chữ s
        if (!req.objKey.permissions){
            return res.status(403).json({
                message: 'Permission Denied error'
            })
        }
        console.log('permissions::', req.objKey.permissions)
        //permission không có s, đây là permission mà được truyền vào xem có pass không?
        const validPermissions = req.objKey.permissions.includes(permission)
        if (!validPermissions) {
            return res.status(403).json({
                message: 'Permission Denied error'
            })
        }
        return next()
    }
}
/*


asyncHandle trong mã nguồn JavaScript mà bạn cung cấp đang là một hàm trung gian, hay còn gọi là middleware, dùng để xử lý các hàm bất đồng bộ trong Express. Cụ thể, asyncHandle nhận vào một hàm fn và trả về một hàm mới mà khi được gọi sẽ thực thi hàm fn đó.

Nếu hàm fn đó phát sinh lỗi trong quá trình thực thi (ví dụ như khi thực hiện truy vấn database hoặc các tác vụ bất đồng bộ khác), lỗi sẽ được bắt và chuyển đến hàm next - đây là một cách thông thường để xử lý lỗi trong các ứng dụng Express.

Thông thường, khi bạn có một hàm bất đồng bộ và bạn muốn sử dụng nó trong route handler hoặc middleware, bạn phải tự mình bắt các lỗi bất đồng bộ và gọi next(error) để chuyển lỗi đến middleware xử lý lỗi tiếp theo. Nhưng khi bạn sử dụng asyncHandle, nó sẽ tự động bắt và chuyển lỗi cho bạn, làm cho mã nguồn của bạn gọn gàng và dễ đọc hơn.

*/
const asyncHandle = fn =>{
    return (req, res, next) =>{
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandle
}