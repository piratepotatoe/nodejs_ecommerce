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

module.exports = {
    apiKey,
    permission
}