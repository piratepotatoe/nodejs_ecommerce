'use strict';

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
//const crypto = require('crypto')
const crypto = require('node:crypto') // có thể sử dụng được từ node version 19 bằng cách khai báo như này

const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfodata } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailtureError, ForbiddenError} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { create } = require("lodash");
const KeyTokenService = require("./keyToken.service");
const {findByRefreshTokenUsed} = require("./keyToken.service");
const KeyTokenModel = require("../models/keytoken.model");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
// class này sẽ quản lý việc login, sign up, -- mọi tính năng liên quan đến việc access 
// import những file ở trong service để chạy ở đây, tách riêng từng file service để xử lý các công việc khác nhau
// ví dụ: login thì sẽ có service của login, sign up thì sẽ có service của sign up
// 
class AccessService {

    static handlerRefreshTokenV2 = async ({keyStore, user, refreshToken}) =>{

        const {userId, email} = user
        console.log(typeof userId)
        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId); // Ensure userId is a string here
            throw new ForbiddenError('Something wrong happens !! Please relogin');
        }
        

        if(keyStore.refreshToken !== refreshToken) new AuthFailtureError('Shop not registered 1')
        
        const foundShop = await findByEmail({email})

        if (!foundShop) throw new AuthFailtureError('Shop not registered 2')

        const tokens = await createTokenPair({userId,email}, keyStore.publicKey, keyStore.privateKey)

        // await keyStore.update({
        //     $set:{
        //         refreshToken: tokens.refreshToken
        //     },
        //     $addToSet:{
        //         refreshTokensUsed: refreshToken // đã được sử dụng để lấy token mới
        //     }
        // })
        await KeyTokenModel.updateOne({ _id: keyStore._id }, {
                    $set: {
                      refreshToken: tokens.refreshToken
                    },
                    $addToSet: {
                      refreshTokensUsed: refreshToken
                    }
                  });
        
                return{
                    user: {userId, email},
                    tokens
                }


    }

    static logout = async (keyStore) => {
        const deleteKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log(deleteKey)
        return deleteKey
    }


    /*
    1 - Check email trong database
    2 - match password cua người dùng nhập vào với password trong database
    3 - tạo Access token và Refresh token và lưu vào
    4 - Generate token
    5 - Get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        //Step 1: Check email trong database
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not registered');

        //Step2: Check password trong database
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailtureError('Authentication error')

        //Step3: Create Public key and private key
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex');

        //Step4: Create Access token and Refresh token
        const { _id: userId } = foundShop

        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
        // save private key and public key 
        await KeyTokenService.createKeyToken({
        refreshToken:tokens.refreshToken,
        privateKey, publicKey, userId

        })
        // return khi login thành công
        return {
            shop: getInfodata({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // try {

        //step1: check if email exist   
        const holderShop = await shopModel.findOne({ email })

        if (holderShop) {
            throw new ConflictRequestError('Error: Shop Already registered')
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
                // return {
                //     code: 'xxx',
                //     message: 'keyStore error'

                // }
                throw new BadRequestError('Error: KeyStore error')
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
                    shop: getInfodata({ fields: ['_id', 'email', 'name'], object: newShop }),
                    tokens
                }
            }
        }
        // Nếu mà shop không tồn tại
        return {
            code: 200,
            metadata: null
        }

        // } catch (error) {
        //     console.error(error);
        //     return {
        //         pass: password,
        //         code: '546456',
        //         message: "Lỗi:" + error.message,
        //         status: 'error'
        //     }
        // }
    }



    // static handlerRefreshToken = async (refreshToken) =>{
    //     const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    //     if (foundToken){
    //         //decode who they are?
    //         const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
    //         console.log(`[1]--`,{userId, email})
    //         //delete
    //         await KeyTokenService.deleteKeyById(userId)
    //         throw new ForbiddenError('Something wrong happens !! Please relogin')
    //     }

    //     const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)

    //     if (!holderToken) throw new AuthFailtureError('Shop not registered 1')

    //     //verify token
    //     const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
    //     console.log(`[2]--`,{userId, email})

    //     //check userID
    //     const foundShop = await findByEmail({email})

    //     if (!foundShop) throw new AuthFailtureError('Shop not registered 2')

    //     //create new Pair Token
    //     const tokens = await createTokenPair({userId,email}, holderToken.publicKey, holderToken.privateKey)

    //     //update token
    //     // await holderToken.update({
    //     //     $set:{
    //     //         refreshToken: tokens.refreshToken
    //     //     },
    //     //     $addToSet:{
    //     //         refreshTokensUsed: refreshToken // đã được sử dụng để lấy token mới
    //     //     }
    //     // })

    //     await KeyTokenModel.updateOne({ _id: holderToken._id }, {
    //         $set: {
    //           refreshToken: tokens.refreshToken
    //         },
    //         $addToSet: {
    //           refreshTokensUsed: refreshToken
    //         }
    //       });

    //     return{
    //         user: {userId, email},
    //         tokens
    //     }
    // }

    // static logout = async (keyStore) => {
    //     const deleteKey = await KeyTokenService.removeKeyById(keyStore._id)
    //     console.log(deleteKey)
    //     return deleteKey
    // }


    // /*
    // 1 - Check email trong database
    // 2 - match password cua người dùng nhập vào với password trong database
    // 3 - tạo Access token và Refresh token và lưu vào
    // 4 - Generate token
    // 5 - Get data return login
    // */
    // static login = async ({ email, password, refreshToken = null }) => {
    //     //Step 1: Check email trong database
    //     const foundShop = await findByEmail({ email })
    //     if (!foundShop) throw new BadRequestError('Shop not registered');

    //     //Step2: Check password trong database
    //     const match = bcrypt.compare(password, foundShop.password)
    //     if (!match) throw new AuthFailtureError('Authentication error')

    //     //Step3: Create Public key and private key
    //     const privateKey = crypto.randomBytes(64).toString('hex')
    //     const publicKey = crypto.randomBytes(64).toString('hex');

    //     //Step4: Create Access token and Refresh token
    //     const { _id: userId } = foundShop

    //     const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
    //     // save private key and public key 
    //     await KeyTokenService.createKeyToken({
    //     refreshToken:tokens.refreshToken,
    //     privateKey, publicKey, userId

    //     })
    //     // return khi login thành công
    //     return {
    //         shop: getInfodata({ fields: ['_id', 'name', 'email'], object: foundShop }),
    //         tokens
    //     }
    // }

    // static signUp = async ({ name, email, password }) => {
    //     // try {

    //     //step1: check if email exist   
    //     const holderShop = await shopModel.findOne({ email })

    //     if (holderShop) {
    //         throw new ConflictRequestError('Error: Shop Already registered')
    //     }

    //     const passwordHash = await bcrypt.hash(password, 10)

    //     const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

    //     console.log(name, email, passwordHash);

    //     if (newShop) {
    //         // Cách 1
    //         // create private key and public key for access
    //         // create key token pair - đầu tiên sẽ tạo ra 1 cặp tokens
    //         // privacy key để sign token, public key để verify token
    //         // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    //         //     modulusLength: 4096,
    //         //     publicKeyEncoding: {
    //         //         type:'pkcs1',
    //         //         format: 'pem'
    //         //     },
    //         //     privateKeyEncoding: {
    //         //         type:'pkcs1',
    //         //         format: 'pem'
    //         //     }
    //         // })
    //         // Thuật toán này quá advanced nên sẽ chuyển sang một thuật toán khác đơn giản hơn, bên trên là phần demo

    //         // Cách 2
    //         // sử dụng crypto của node
    //         const privateKey = crypto.randomBytes(64).toString('hex');
    //         const publicKey = crypto.randomBytes(64).toString('hex');


    //         console.log({ privateKey, publicKey }); // if exist, save to collection keystore

    //         const keyStore = await KeyTokenService.createKeyToken({
    //             //xem KeyTokenService
    //             //xem KeyToken model
    //             userId: newShop._id,
    //             publicKey,
    //             privateKey
    //         })

    //         if (!keyStore) {
    //             // return {
    //             //     code: 'xxx',
    //             //     message: 'keyStore error'

    //             // }
    //             throw new BadRequestError('Error: KeyStore error')
    //         }

    //         // const publicKeyObject = crypto.createPublicKey(publicKeyString)
    //         // create token pair 

    //         const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

    //         console.log(`Create Token Sucessfully`, tokens);

    //         return {
    //             code: 201,
    //             metadata: {
    //                 // shop: newShop,
    //                 // tokens: tokens,
    //                 shop: getInfodata({ fields: ['_id', 'email', 'name'], object: newShop }),
    //                 tokens
    //             }
    //         }
    //     }
    //     // Nếu mà shop không tồn tại
    //     return {
    //         code: 200,
    //         metadata: null
    //     }

    //     // } catch (error) {
    //     //     console.error(error);
    //     //     return {
    //     //         pass: password,
    //     //         code: '546456',
    //     //         message: "Lỗi:" + error.message,
    //     //         status: 'error'
    //     //     }
    //     // }
    // }
}

module.exports = AccessService