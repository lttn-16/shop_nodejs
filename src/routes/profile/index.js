const express = require("express");
const profileController = require("../../controllers/profile.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth");
const { grantAccess } = require("../../middleware/rbac");

router.use(authentication);

// admin
router.get(
    "/view-any",
    grantAccess("readAny", "profile"),
    asyncHandler(profileController.profiles),
);

// shop
router.get(
    "/view-own",
    grantAccess("readOwn", "profile"),
    asyncHandler(profileController.profile),
);

module.exports = router;
