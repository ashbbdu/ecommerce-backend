const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const Profile = require("../models/Profile");
const { sendMailer } = require("../utils/MailSender");
const Product = require("../models/Product");

// otp send
module.exports.sendOpt = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email, "email");

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Please fill the required field",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: `User with email - ${email} alredy exist`,
      });
    }

    const otp = Math.floor(Math.random() * 899999 + 100000);
    const otpData = await Otp.create({ email, otp, createdAt: Date.now() });

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully`,
      otp: otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: `Something went wrong while sending the otp , please try again`,
    });
  }
};
// signup

module.exports.signup = async (req, res) => {
  try {
    const {
      otp,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;
    console.log(otp, "otp");
    if (
      !otp ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType
    ) {
      return res.status(404).json({
        success: false,
        message: "Please fill the required field",
      });
    }
    if (password !== confirmPassword) {
      return res.status(404).json({
        success: false,
        message: "Password does not match",
      });
    }
    const existingUser = await User.findOne({ email });
    console.log(existingUser , "existing user")
    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: "User alredy registered",
      });
    }

    const getOtp = await Otp.find({});
    console.log(getOtp , "getotp")


    // console.log(getOtp.slice(-1), "recentOtp");
    const recentOtp = getOtp[getOtp.length - 1].otp;
    console.log(recentOtp , "recentOtp")


    // this code is working but the logic is wierd
    if (String(recentOtp) !== String(otp)) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: `Something went wrong while creating user , please try again`,
    });
  }
};

// login

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not registered , kindly signup",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrenct Password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to login please try again",
    });
  }
};

// changePassoword

module.exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    // const user = await User.findById(req.user);
    const user = await User.findOne({ email });
    console.log(user, "user");

    if (!oldPassword || !newPassword) {
      return res.status(404).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    const comparePassword = await bcrypt.compare(oldPassword, user.password);

    if (!comparePassword) {
      return res.status(404).json({
        success: false,
        message: "Incorrect old Password",
      });
    }

    // hash the passworld
    const haseNewPassword = await bcrypt.hash(newPassword, 10);

    const updatePassword = await User.findOneAndUpdate(
      { email },
      { password: haseNewPassword },
      { new: true }
    );

    // send confirmation message for password change
    try {
      await sendMailer(
        "Password has been updated",
        email,
        `Hi ${user.firstName} your passworld has been updated <br> Thanks , <br> Team Ecommerce`
      );
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Unable to send email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password Updated Sucessfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to change password please try again",
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).populate("additionalDetails");
    res.status(200).json({
      success: true,
      message: "All users",
      data: allUsers,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.deleteAccount = async (req , res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user) {
      return res.status(404).json({
        success : false,
        message : "User not registered with us"
      })
    }
  const products = user.product.map(res => {
    return res.toString()
  })
    const delteUser = await User.findOneAndDelete({email})
    for(let i = 0; i <= products.length ; i++) {
      const updateDb = await Product.findByIdAndDelete(products[i])
      console.log(updateDb , "updateDb") 
    }
 

    res.status(200).json({
      success : true,
      message : "User deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting the account",
      error: error.message,
    })
  }
}
