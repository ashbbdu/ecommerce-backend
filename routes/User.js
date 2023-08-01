const express = require("express");
const { sendOpt, signup, getAllUsers, login, changePassword, deleteAccount } = require("../controllers/Auth");
const router = express.Router()

// Auth Routes
router.post("/send-otp" , sendOpt)
router.post("/signup" , signup)
router.post("/login" , login)
router.post("/change-password" , changePassword)
router.get("/allUsers" , getAllUsers)
router.delete("/delete-user" , deleteAccount)


// Auth Routes


module.exports = router;