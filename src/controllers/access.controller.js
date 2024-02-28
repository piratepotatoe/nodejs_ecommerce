'use strict';

class AccessController {
    signUp = async (req, res, next) => {
        try {
            /*
            200 OK
            201 Created
            */
            console.log(`[P]::signUp::`, req.body)
            return res.status(200).json({
                code: '20001', // 20001 là định nghĩa riêng
                metadata: { userid: 1 }

            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController()