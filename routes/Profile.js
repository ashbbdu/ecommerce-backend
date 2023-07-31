const express = require("express");
const { updateProfile } = require("../controllers/Profile");
const { auth } = require("../middlewares/auth");
const router = express.Router()

// Profile Routes
router.post("/updateProfile" , auth , updateProfile)


// Profile Routes

module.exports = router;