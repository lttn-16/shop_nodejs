const { convertToObjectIdMongodb } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const Discount = require("../models/discount.model");

class DiscountService {
    static async createDiscountCode({
        code,
        description,
        start_date,
        end_date,
        min_order_value,
        discount_applies_to,
        max_usage,
        name,
        used_count,
        max_usage_per_user,
        product_ids,
        shop_id,
        status,
        type,
        value,
    }) {
        // validate input
        if (new Date() > new Date(end_date)) {
            throw new BadRequestError("End date must be in the future");
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date");
        }

        const foundDiscount = await Discount.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id),
        }).lean();
        if (foundDiscount && foundDiscount.status === true) {
            throw new BadRequestError(
                "Discount code already exists and is active",
            );
        }

        const newDiscount = await Discount.create({
            discount_name: name,
            discount_code: code,
            description,
            discount_type: type,
            discount_value: value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_min_order_value: min_order_value,
            discount_max_per_user: max_usage_per_user,
            max_value: max_usage,
            used_count: used_count || 0,
            discount_product_ids:
                discount_applies_to === "specific"
                    ? product_ids.map((id) => convertToObjectIdMongodb(id))
                    : [],
            discount_shop_id: convertToObjectIdMongodb(shop_id),
            discount_status: status,
            discount_applies_to,
        });
        return newDiscount;
    }

    static async applyDiscountCode({ code, user_id, shop_id, products }) {
        const discount = await Discount.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id),
        }).lean();

        if (!discount) {
            throw new NotFoundError("Discount code not found");
        }
        if (!discount.discount_status) {
            throw new BadRequestError("Discount code is not active");
        }
        if (new Date() > new Date(discount.discount_end_date)) {
            throw new BadRequestError("Discount code has expired");
        }
        const totalOrderValue = products.reduce(
            (total, product) => total + product.price * product.quantity,
            0,
        );
        if (discount.min_order_value > 0) {
            if (totalOrderValue < discount.discount_min_order_value) {
                throw new BadRequestError(
                    `Minimum order value to apply this discount is ${discount.discount_min_order_value}`,
                );
            }
        }
        if (discount.max_usage_per_user > 0) {
            const userUsageCount = discount.used_by.filter(
                (id) => id.toString() === user_id,
            ).length;
            if (userUsageCount >= discount.discount_max_per_user) {
                throw new BadRequestError(
                    "You have reached the maximum usage limit for this discount code",
                );
            }
        }
        if (
            discount.max_value > 0 &&
            discount.used_count >= discount.max_value
        ) {
            throw new BadRequestError(
                "This discount code has reached its maximum usage limit",
            );
        }

        const amount =
            discount.discount_type === "percentage"
                ? (totalOrderValue * discount.discount_value) / 100
                : discount.discount_value;

        return {
            total: totalOrderValue,
            discount_amount: amount,
            final_total: totalOrderValue - amount,
        };
    }

    static async cancelDiscountCode({ code, user_id, shop_id }) {
        const discount = await Discount.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id),
        });

        if (!discount) {
            throw new NotFoundError("Discount code not found");
        }

        const result = await Discount.findOneAndUpdate({
            $pull: { used_by: user_id },
            $inc: { max_value: 1, used_count: -1 },
        });
        return result;
    }
}

module.exports = DiscountService;
