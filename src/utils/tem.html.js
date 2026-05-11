/**
 * Template HTML cho Email xác thực Token
 * @returns {string} - Chuỗi HTML chứa placeholder {{link_verify}}
 */
const htmlEmailToken = () => {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
            .header { text-align: center; padding-bottom: 20px; }
            .content { line-height: 1.6; color: #333; }
            .cta-button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Chào mừng bạn đến với ShopDEV!</h2>
            </div>
            <div class="content">
                <p>Cảm ơn bạn đã đăng ký tài khoản. Để hoàn tất quy trình xác thực, vui lòng nhấn vào nút bên dưới:</p>
                <div style="text-align: center;">
                    <a href="{{link_verify}}" class="cta-button">Xác nhận Email của tôi</a>
                </div>
                <p>Nếu nút trên không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
                <p style="word-break: break-all; color: #007bff;">{{link_verify}}</p>
                <p>Liên kết này sẽ <strong>hết hạn sau 60 giây</strong> vì lý do bảo mật.</p>
            </div>
            <div class="footer">
                <p>© 2026 ShopDEV. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    htmlEmailToken
};