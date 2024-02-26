'use strict'

const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/yourDatabase'
mongoose.connect(connectString).then( _ =>  console.log(`Connected Mongdodb Success`))
.catch(err => console.log(`Error Connect!`))

//dev


module.exports = mongoose