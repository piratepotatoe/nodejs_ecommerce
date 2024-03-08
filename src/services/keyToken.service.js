'use strict';
const keyTokenModel =  require('../models/keytoken.model')
// const { Types } = require('mongoose')
const { Types: { ObjectId } } = require('mongoose')

class KeyTokenService {
    // Trong class KeyTokenService, yêu cầu 2 parameter, 1 là user id, 2 là public key, tuy nhiên,
    // cần thêm cả private key nữa
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => { 
        try {

            const filter = {user: userId}, 
            update ={
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }, options = {
                upsert: true,
                new: true
            }
        
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            console.log('Tokens:', tokens);
            return tokens ? tokens.publicKey : null

        } catch (error) {
            // Thêm xử lý lỗi
            console.error('Key token service -> Error creating key token:', error.message);
            return error
        }
    }

    //  static findByUserId = async (userId) => {
    //     // nhận param là userId -> dùng findOne để đi tìm
    //     return await keytokenModel.findOne({user: Types.ObjectId(userId)}).lean()
    //  }

     static findByUserId = async (userId) => {
        // let a=  keytokenModel.findOne({})
        return await keyTokenModel.findOne({ user: new ObjectId(userId) }).lean();
    }

    static removeKeyById = async ({id}) => {
        return await keyTokenModel.deleteOne({ _id: new ObjectId(id) });
    }
   
     
    
}

module.exports = KeyTokenService;
