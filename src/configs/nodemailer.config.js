const nodemailer = require('nodemailer');

async function getAccount() {
    let testAccount = await nodemailer.createTestAccount();
    console.log('--- COPY THÔNG TIN NÀY ---');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
    console.log('---------------------------');
}

const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // sử dụng SSL
    auth: {
        user: 'k5l7cul2m6wotpgj@ethereal.email',
        pass: '5WRUPcnDuNQBX95zrC'
    }
})

module.exports = transport