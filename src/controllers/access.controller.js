'use strict';
const AccessService = require("../services/access.service")

const { OK, CREATED, SuccessResponse } = require("../core/success.response")

class AccessController {
    handleRefreshToken = async (req, res, next) =>{
        // if (!req.user) {
        //     return res.status(400).send("User information is missing");
        // }
        //V2
        new SuccessResponse({
            message:'Get token success',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        })

       
    }

    logout = async (req, res, next) => {
       //res.send('234')
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
        
    }

    // chưa validate param đầu vào
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registration successfully',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }
}

module.exports = new AccessController()