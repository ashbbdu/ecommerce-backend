const mongoose = require("mongoose");
const { sendMailer } = require("../utils/MailSender");

const Otp = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 60,
  },
});

Otp.post("save", async (doc) => {
  try {
    await sendMailer(
      "User Verification Mail from Ecommerce App",
      doc.email,
      `OTP for verification is ${doc.otp} , please enter the OTP to finish the Registration Process`
    );
  } catch (e) {
    console.log(e);
  }
});

module.exports = mongoose.model("Otp", Otp);
