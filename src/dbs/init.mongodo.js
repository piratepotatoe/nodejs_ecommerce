'use strict'

const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/demo'

// sử dụng singleton để call 1 lần, thay vì call lại nhiều lần database

class Database{
    constructor(){
        this.connect()
    }
    // sau này nếu có nhiều data khác nhau thì thay vào chỗ mongodb là được
    connect(type = 'mongodb'){

        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug', {color:true})
        }

        mongoose.connect(connectString).then( _ =>  console.log(`Connected Mongdodb Success`))
        .catch(err => console.log(`Error Connect!`))
    }
   
    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb