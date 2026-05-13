const crypto = require('crypto');
const OTP = require('../models/otp.model')

const generatorTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32))
    return token
}

const newOtp = async ({
    email
}) => {
    const token = generatorTokenRandom()
    const newToken = await OTP.create({
        otp_token: token,
        otp_email: email
    })

    return newToken
}

const checkEmailToken = async ({
    token
}) => {
    // 1. Kiểm tra token có tồn tại trong model OTP hay không
    const foundToken = await OTP.findOne({
        otp_token: token
    })

    // 2. Nếu không tìm thấy, ném ra lỗi
    if(!foundToken) throw new Error('token not found')

    // 3. Xóa token khỏi model sau khi đã tìm thấy (để tránh sử dụng lại)
    OTP.deleteOne({ otp_token: token }).then()

    // 4. Trả về thông tin token đã tìm được
    return foundToken;
}

module.exports = {
    newOtp,
    checkEmailToken,
}