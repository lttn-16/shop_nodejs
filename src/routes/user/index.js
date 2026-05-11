const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const userController = require('../../controllers/user.controller');

router.post('/new_user', asyncHandler(userController.newUser));

module.exports = router;