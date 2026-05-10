const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

const profiles = [
    {
        user_id: 1,
        user_name: "User1",
    },
    {
        user_id: 1,
        user_name: "User2",
    },
    {
        user_id: 1,
        user_name: "User3",
    },
];

class ProfileController {
    // admin
    profiles = async (req, res, next) => {
        return new SuccessResponse({
            message: "View all profile successfully",
            metadata: profiles,
        }).send(res);
    };
    // shop
    profile = async (req, res, next) => {
        return new SuccessResponse({
            message: "View one profile successfully",
            metadata: {
                user_id: 1,
                user_name: "User1",
            },
        }).send(res);
    };
}

module.exports = new ProfileController();
