const { Types } = require("mongoose");
const crypto = require('crypto');

const createRandomString = (size = 20) => {
    return crypto.randomBytes(size).toString('hex');
};

const getClouldfrontUrl = (name) => {
    return `https://${process.env.AWS_CLOUD_FRONT_URL}/${name}`
}

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach((a) => {
                final[`${key}.${a}`] = response[a];
            });
        } else {
            final[key] = obj[key];
        }
    });
    return final;
};

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (
            obj[key] &&
            typeof obj[key] === "object" &&
            !Array.isArray(obj[key])
        ) {
            removeUndefinedObject(obj[key]);
            if (Object.keys(obj[key]).length === 0) {
                delete obj[key];
            }
        }
        else if (obj[key] == null) {
            delete obj[key];
        }
    });
    return obj;
};

module.exports = {
    convertToObjectIdMongodb,
    updateNestedObjectParser,
    removeUndefinedObject,
    createRandomString,
    getClouldfrontUrl,
};
