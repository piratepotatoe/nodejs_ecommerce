'use strict';

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
//const crypto = require('crypto')
const crypto = require('node:crypto') // có thể sử dụng được từ node version 19 bằng cách khai báo như này
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const {getInfodata} = require("../utils")

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

            const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

            console.log(name, email, passwordHash);

            if (newShop) {
                // Cách 1
                // create private key and public key for access
                // create key token pair - đầu tiên sẽ tạo ra 1 cặp tokens
                // privacy key để sign token, public key để verify token
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type:'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type:'pkcs1',
                //         format: 'pem'
                //     }
                // })
                // Thuật toán này quá advanced nên sẽ chuyển sang một thuật toán khác đơn giản hơn, bên trên là phần demo

                // Cách 2
                // sử dụng crypto của node
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');


                console.log({ privateKey, publicKey }); // if exist, save to collection keystore

                const keyStore = await KeyTokenService.createKeyToken({
                    //xem KeyTokenService
                    //xem KeyToken model
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'keyStore error'

                    }
                }

                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                // create token pair 

                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

                console.log(`Create Token Sucessfully`, tokens);

                return {
                    code: 201,
                    metadata: {
                        // shop: newShop,
                        // tokens: tokens,
                       shop: getInfodata({fields:['_id', 'email', 'name'], object: newShop}),
                       tokens
                    }
                }
            }
            // Nếu mà shop không tồn tại
            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            console.error(error);
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