const express = require('express');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth');

router.use(authentication);

// get cart
router.get('/', asyncHandler(cartController.getCart));

// add to cart
router.post('/add', asyncHandler(cartController.addToCart));

// delete cart
router.post('/delete', asyncHandler(cartController.deleteCart));

// update cart
router.post('/update', asyncHandler(cartController.updateCart));


module.exports = router;
