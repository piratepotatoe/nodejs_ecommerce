'use strict';
const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey}) => { // Sửa tên phương thức
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await keytokenModel.create({
                user: userId, // Sửa thành user hoặc userId tùy vào ý định
                publicKey: publicKeyString
                
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
