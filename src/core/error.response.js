const StatusCodes = {
    CONFLICT: 409,
    FORBIDDEN: 403,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
}

const ErrorMessages = {
    CONFLICT: "Conflict error",
    FORBIDDEN: "Forbidden error",
    BAD_REQUEST: "Bad request error",
    UNAUTHORIZED: "Unauthorized error",
    NOT_FOUND: "Not found error",
}

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ErrorMessages.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ErrorMessages.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ErrorMessages.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

class UnauthorizedError extends ErrorResponse {
    constructor(message = ErrorMessages.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ErrorMessages.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    ForbiddenError,
    UnauthorizedError,
    NotFoundError,
};