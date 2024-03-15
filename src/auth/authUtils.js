'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailtureError, NotFoundError } = require('../core/error.response');
const {findByUserId} = require('../services/keyToken.service');



const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
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


const authenticationV2 = asyncHandler(async (req, res, next) => {
    
    
    const userId= req.headers[HEADER.CLIENT_ID]

    console.log("User id", userId)

    if(!userId) throw new AuthFailtureError('Invalid Request')

    //step 2

    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Keystore not found')

    //step 3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try{
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]

            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

            console.log('decodeUser [1]', decodeUser);

            if(userId !== decodeUser.userId)
            throw new AuthFailtureError('Invalid user ID')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        }catch(err){
            throw err.message
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailtureError('Invalid KeyStore')

    //step 4
    try{
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        console.log('decodeUser [2]', decodeUser);
        if(userId!== decodeUser.userId)
        throw new AuthFailtureError('Invalid user ID')
        req.user = decodeUser // trong decode user {userId, email}
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
    authenticationV2,
    verifyJWT
};
