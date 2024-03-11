'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailtureError, NotFoundError } = require('../core/error.response');
const {findByUserId} = require('../services/keyToken.service');



const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {

    try {
        // Note: JWT.sign is used synchronously here

        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        });

        // Verification could be moved to where you need to validate tokens
        // This is just for demonstration and likely not needed here
        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error(`Error verifying accessToken: ${err}`);
            } else {
                console.log(`AccessToken decoded successfully: `, decoded);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error(`Error creating token pair: ${error.message}`);

        // Ensure to handle this error appropriately in production code
        return null; // or throw new Error(error);
    }
}

//authentication Utils

// const authenticationUtils = asyncHandler(async (req, res, next) => {

//     /*
//     1. check if user is missing?
//     2. get access token
//     3. verify token
//     4. check if user exists in database
//     5. check keystore with this user id
//     6. if passed => return next()
//     api, client user id, access token cần check ba tham số này
//     */
//     //Step 1 - get user id 
//     const userId = req.headers[HEADER.CLIENT_ID]

//     console.log(`userId`, userId);

//     // nếu không mang theo client id thì return lỗi luôn
//     if (!userId) throw new AuthFailtureError('Invalid request')

//     //Step 2 Get keystore access
//     const keyStore = await findByUserId(userId)

//     if (!keyStore) throw new NotFoundError('Not found keystore')
//     // Step 3 Verify token
//     const accessToken = req.headers[HEADER.AUTHORIZATION]

//     console.log(`accessToken`, accessToken);
//     console.log('Keystore '+keyStore.publicKey)

//     if (!accessToken) throw new AuthFailtureError('Not found keystore')
    
//     try {
        
//         const decodedUser = JWT.verify(accessToken, keyStore.publicKey)
//         console.log(`decodedUser`, decodedUser);
//         //return next()
//         if (userId !== decodedUser.userId) throw new AuthFailtureError('Invalid user')

//         req.keyStore = keyStore
//         return next()
//     } catch (error) {
//         console.log('Authenticateion: AuthUtls' + error.message);
//     }
// })

const authentication = asyncHandler(async (req, res, next) => {
    const userId= req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailtureError('Invalid Request')

    //step 2

    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Keystore not found')

    //step 3

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailtureError('Invalid KeyStore')

    //step 4
    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId!== decodeUser.userId)
        throw new AuthFailtureError('Invalid user ID')
        req.keyStore = keyStore
        return next()
    }catch(err){
        throw err.message
    }
})

const verifyJWT = async (token, keySecret) =>{
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
};
