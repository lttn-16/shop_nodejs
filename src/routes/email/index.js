const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const emailController = require('../../controllers/email.controller');

// Route tạo mới một template email
router.post('/new_template', asyncHandler(emailController.newTemplate));

module.exports = router;