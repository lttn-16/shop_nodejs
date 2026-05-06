const express = require('express');
const router = express.Router();
const { apiKey, permissions } = require('../auth/checkAuth');

// check api key
router.use(apiKey);
// check permissions
router.use(permissions('0000'));

router.use('/v1/api', require('./access'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/discount', require('./discount'));

module.exports = router;
