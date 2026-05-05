const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth');

router.use(authentication);

// create product
router.post('/', asyncHandler(productController.create));

// update product
router.put('/:id', asyncHandler(productController.update));

module.exports = router;
