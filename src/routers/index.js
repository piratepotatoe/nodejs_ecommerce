'use strict';
const express = require('express')
const router = express.Router()


router.use('/v1/api', require('./access'))

// router.get('', (req, res, next) => {
//     const strCompress = 'hello daring fox';
//     return res.status(200).json({
//         message: 'Welcome Daring Fox',
//         metadata: strCompress.repeat(10000)
//     });
// });
module.exports = router