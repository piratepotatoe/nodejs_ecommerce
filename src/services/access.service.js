'use strict';

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")


const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {

            //step1: check if email exist
            const holderShop = await shopModel.findOne({ email }).lean()

            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Email already exist'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create(
                {
                    name, email, password: passwordHash, roles: [RoleShop.SHOP]
                }
            )
            console.log('chưa chạy vào đây');
            if (newShop) {
                // create private key and public key for access
                // create key token pair - đầu tiên sẽ tạo ra 1 cặp tokens
                // privacy key để sign token, public key để verify token
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })
                console.log({ privateKey, publicKey }); // if exist, save to collection keystore

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    
                    }
                }
                // create token pair 
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log(`Create Token Sucessfully`, tokens);
                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens: tokens,

                    }
                }
            }
            // Nếu mà shop không tồn tại
            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
            pass: password,
                code: '546456',
                message: "Lỗi:" + error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService