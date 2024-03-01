'use strict';

// quản lý API
// thời gian access vào server
// ví dụ khi mình đẩy data từ backend về adnetwork để họ nhận dữ liệu thì họ sẽ cần cái này

const mongoose = require('mongoose'); // Erase if already required

// đây sẽ là thư mục được ghi vào database
const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    //key sẽ là phần mình generate ra
    // người dùng sẽ add vào header của service
    key:{
        type:String,
        required:true,
        unique:true
    },
    //status là true, có nghĩa có hoạt động hay không
    status:{
        type:Boolean,
        default:true
    },


    permissions:{
        type:[String],
        required:true,
        enum:['0000','1111','2222']
    }
});

//Export the model
module.exports = mongoose.model('User', userSchema);
