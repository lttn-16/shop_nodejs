const StatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
};

const ReasonStatusCode = {
    [StatusCode.OK]: "OK",
    [StatusCode.CREATED]: "Created",
    [StatusCode.ACCEPTED]: "Accepted",
    [StatusCode.NO_CONTENT]: "No Content",
};

class SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.OK,
        reasonStatusCode = ReasonStatusCode[StatusCode.OK],
        metadata = {},
    }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({
            message,
            statusCode: StatusCode.OK,
            reasonStatusCode: ReasonStatusCode[StatusCode.OK],
            metadata,
        });
    }
}

class Created extends SuccessResponse {
    constructor({ message, metadata, options }) {
        super({
            message,
            statusCode: StatusCode.CREATED,
            reasonStatusCode: ReasonStatusCode[StatusCode.CREATED],
            metadata,
        });
    }
}

module.exports = {
    SuccessResponse,
    OK,
    Created,
};
