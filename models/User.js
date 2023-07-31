const mongoose = require("mongoose");

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password : {
    type: String,
    required: true,
    trim: true,
  },
  accountType : {
    type: String,
    enum: ["Admin", "Buyer", "Seller"],
    required: true,
  },
  image : {
    type: String,
    required: true,
    trim: true,
  },
  product : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Product",
    required : true,
  }],
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile",
},
});

module.exports = mongoose.model("User" , User)
