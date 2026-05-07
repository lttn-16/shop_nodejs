const notificationModel = require("../models/notification.model");

class NotificationService {
    static async pushToNotiSystem({
        noti_senderId,
        noti_receiverId,
        noti_type,
        noti_options,
    }) {
        let content;
        if (noti_type === "PRODUCT") {
            content = "New product!!";
        }
        const newNoti = await notificationModel.create({
            noti_senderId,
            noti_receiverId,
            noti_type,
            noti_content: content,
            noti_options,
        });
        return newNoti;
    }
}

module.exports = NotificationService;
