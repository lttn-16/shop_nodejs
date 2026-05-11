const express = require('express');
const router = express.Router();
const { apiKey, permissions } = require('../auth/checkAuth');

// check api key
// router.use(apiKey);
// check permissions
// router.use(permissions('0000'));

router.use('/v1/api', require('./access'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/upload', require('./upload'));
router.use('/v1/api/profile', require('./profile'));
router.use('/v1/api/email', require('./email'));
router.use('/v1/api/user', require('./user'));

module.exports = router;
