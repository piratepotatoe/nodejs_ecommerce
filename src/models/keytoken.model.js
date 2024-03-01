'use strict';

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// Cách 1 khi sử dụng RSA 256
// var keyTokenSchema = new Schema({
//     user: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: 'Shop'
//     },
//     publicKey: {
//         type: String,
//         required: true
//     }
//     , refreshToken: {
//         type: Array,
//         default: []
//     }
// }
//     , {
//         collection: COLLECTION_NAME,
//         timestamps: true

//     });

// Cách 2 sử dụng đơn giản
// Cách này sẽ yêu cầu public key, private key
var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    }
    ,
    privateKey: {
        type: String,
        required: true
    }
    , refreshToken: {
        type: Array,
        default: []
    }
}
    , {
        collection: COLLECTION_NAME,
        timestamps: true

    });


module.exports = model(DOCUMENT_NAME, keyTokenSchema);