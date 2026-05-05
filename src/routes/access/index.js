const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth');

// Signup
router.post('/shop/signup', asyncHandler(accessController.signup));
// Login
router.post('/shop/login', asyncHandler(accessController.login));
// Authentication
router.use(authentication);

// Logout
router.post('/shop/logout', asyncHandler(accessController.logout));
// Refresh token
router.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
