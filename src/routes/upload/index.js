const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth');

router.use(authentication);

router.post('/', asyncHandler(uploadController.upload));

module.exports = router;
