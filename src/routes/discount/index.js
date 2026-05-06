const express = require('express');
const discountController = require('../../controllers/discount.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth');

router.use(authentication);

// create discount
router.post('/', asyncHandler(discountController.create));

// apply discount
router.post('/apply', asyncHandler(discountController.applyDiscount));

// cancel discount
router.post('/cancel', asyncHandler(discountController.cancelDiscount));

module.exports = router;
