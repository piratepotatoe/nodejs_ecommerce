'use strict';
const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    // Trong class KeyTokenService, yêu cầu 2 parameter, 1 là user id, 2 là public key, tuy nhiên,
    // cần thêm cả private key nữa
    static createKeyToken = async ({userId, publicKey, privateKey}) => { 
        try {
           // const publicKeyString = publicKey.toString(); 
            const tokens = await keytokenModel.create({
                user: userId, 
                publicKey,
                privateKey
                
            }); 
            return tokens ? tokens.publicKey : null
            
        } catch (error) {
            // Thêm xử lý lỗi
            console.error('Key token service -> Error creating key token:', error.message);
            return error
        }
    }
}

module.exports = KeyTokenService;
