const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
module.exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token missing",
      });
    }
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode", decode);
      req.user = decode;
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to verify token",
    });
  }
};

module.exports.isBuyer = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (user.accountType !== "Buyer") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Buyer",
      });
    }
  } catch (error) {
    return res.status(500).json({ 
        success: false, 
        message: `User Role Can't be Verified` });
  }
  next();
};

module.exports.isSeller = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      if (user.accountType !== "Seller") {
        return res.status(401).json({
          success: false,
          message: "This is a protected route for Seller",
        });
      }
    } catch (error) {
      return res.status(500).json({ 
          success: false, 
          message: `User Role Can't be Verified` });
    }
    next();
  };

  module.exports.isAdmin = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      if (user.accountType !== "Admin") {
        return res.status(401).json({
          success: false,
          message: "This is a protected route for Admin",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({ 
          success: false, 
          message: `User Role Can't be Verified` });
    }

  };
