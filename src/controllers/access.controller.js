'use strict';
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        try {
            /*
            200 OK
            201 Created
            */
            console.log(`[P]::signUp::`, req.body)
            
            return res.status(201).json(
                await AccessService.signUp(req.body)
            )
        } catch (error) {
            console.error('Error signing up'+error.message)
            next(error)
        }
    }
}

module.exports = new AccessController()