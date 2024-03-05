'use strict';

const { StatusCodes,ReasonPhrases  } = require("./httpStatusCode");

// const StatusCode = {
//     OK: 200,
//     CREATED: 201,
//     NO_CONTENT: 204,
//     BAD_REQUEST: 400,
//     UNAUTHORIZED: 401,
//     FORBIDDEN: 403,
//     NOT_FOUND: 404,
//     INTERNAL_SERVER_ERROR: 500
// }
// const ReasonStatusCode = {
//     OK: 'OK',
//     CREATED: 'Created',
//     NO_CONTENT: 'No Content',
//     BAD_REQUEST: 'Bad Request',
//     UNAUTHORIZED: 'Unauthorized',
//     FORBIDDEN: 'Forbidden',
//     NOT_FOUND: 'Not Found',
//     INTERNAL_SERVER_ERROR: 'Internal Server Error'
// }

class ErrorResponse extends Error{
    constructor(message, status){
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode)
    }
    
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST){
        super(message)
        this.status = status
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}