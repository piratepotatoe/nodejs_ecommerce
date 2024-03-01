'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {

    try {
        // Note: JWT.sign is used synchronously here
        
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
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

module.exports = {
    createTokenPair
};
