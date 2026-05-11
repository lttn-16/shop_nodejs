const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 465,
    secure: true, // sử dụng SSL
    auth: {
        user: '',
        pass: ''
    }
})

module.exports = transport