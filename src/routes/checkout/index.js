const express = require('express');
const checkoutController = require('../../controllers/checkout.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth');

router.use(authentication);

// review 
router.post('/review', asyncHandler(checkoutController.review));



module.exports = router;
