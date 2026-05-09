const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth');
const { uploadDisk } = require('../../configs/multer.config')

router.use(authentication);

router.post('/', asyncHandler(uploadController.upload));
router.post('/product/files', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadFiles));
router.post('/product', uploadDisk.single('file'), asyncHandler(uploadController.uploadProduct));

module.exports = router;
