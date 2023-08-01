const express = require("express");
const { contactUs } = require("../controllers/Contact");
const router = express.Router()

// Auth Routes
router.post("/contact" , contactUs)



// Auth Routes


module.exports = router;