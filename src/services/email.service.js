const { newOtp } = require('./otp.service');
const { getTemplate } = require('./template.service');
const transport = require('../configs/nodemailer.config');
const { replacePlaceholder } = require('../utils')
const { NotFoundError } = require('../core/error.response')

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = 'Xác nhận Email đăng ký!',
    text = 'xác nhận..'
}) => {
    try {
        const mailOptions = {
            from: '"ShopDEV" <anonystick@gmail.com>',
            to: toEmail,
            subject,
            text,
            html
        }

        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                // Thay console.log bằng logger chuyên nghiệp bạn đã viết
                return console.log(err);
            }

            console.log('Message sent::', info.messageId);
        })
    } catch (error) {
        console.error(`error send Email::`, error);
        return error;
    }
}

const sendEmailToken = async ({
    email = null
}) => {
    try {
        // 1. Get Token (Tạo mã OTP/Token ngẫu nhiên và lưu DB)
        const token = await newOtp({ email })

        // 2. Get Template (Lấy mẫu HTML từ Database)
        const template = await getTemplate({
            tem_name: 'Template 05'
        })

        if (!template) {
            throw new NotFoundError('Template not found')
        }

        // 3. Replace placeholder with params (Đổ dữ liệu động vào HTML)
        const content = replacePlaceholder(
            template.tem_html,
            {
                link_verify: `http://localhost:3056/cgp/welcome-back?token=${token.otp_token}`
            }
        )

        // 4. Send email (Gọi transport để gửi mail thật)
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Vui lòng xác nhận địa chỉ Email đăng ký ShopDEV.com!'
        }).catch(err => console.error(err))

        return 1
    } catch (error) {
        // Bạn có thể dùng myLogger.error ở đây để ghi log lỗi
        console.error(error)
        throw error
    }
}

module.exports = {
    sendEmailToken,
}