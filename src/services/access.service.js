'use strict';

const shopModel = require('../app/models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const RoleShop = {
    SHOP: 'shop',
    WRITER: '0001',
    EDITOR: '0002',
    ADMIN: '0003'
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            //step1: check if email exist
            const holderShop = await shopModel.findOne({ email }).lean()

            if (holderShop) {
                return {
                    code: ('xxx'),
                    message: 'Email already exist',
                    status: 'error'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await newShopModel.create(
                {
                    name, email, password: passwordHash, roles: [RoleShop.SHOP]
                }
            )
            if (newShop) {
                // create private key and public key for access
                // privacy key để sign token, public key để verify token
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
                    moduluslength:4096
                })
                console.log({privateKey,publicKey}); // if exist, save to collection keystore
            }

        } catch (error) {
            return {
                code: ('xxx'),
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService()