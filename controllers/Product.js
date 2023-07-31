const Product = require("../models/Product");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
module.exports.createProduct = async (req, res) => {
  try {
    const { email, name, title, price, offers, ratingAndReview } = req.body;
    const { image } = req.files;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User is not registered with us",
      });
    }

    if (!name || !title || !price || !image) {
      return res.status(404).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // check if user is seller or not , only seller can add products

    const sellerDetails = await User.findOne(
      { email },
      {
        accountType: "Seller",
      }
    );
    console.log(sellerDetails, "seller details");

    if (sellerDetails.accountType !== "Seller") {
      return res.status(404).json({
        success: false,
        message: "Only Seller is allowed to create products",
      });
    }

    // Upload Product image to cloudinary
    const productImage = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );
    console.log(productImage, "productImage");

    //   create product
    const newProduct = await Product.create({
      name: name,
      title: title,
      price: price,
      image: productImage.secure_url,
      offers: offers._id,
      ratingAndReview: ratingAndReview._id,
    });
    console.log(newProduct, "new Product");

    //   store product data into user modal
    const storeData = await User.findByIdAndUpdate(
      { _id: sellerDetails._id },
      {
        $push: {
          product: newProduct._id,
        },
      },
      { new: true }
    );

    console.log(storeData, "storedata");
    return res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to add product please try again",
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { name, email, title, offers, ratingAndReview, productId } = req.body;
    console.log(productId, "productId");
    const { image } = req.files;

    const user = await User.findOne({ email });
    // findProductAndupdate

    const productImage = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );
    console.log(productImage, "productImage");

    console.log(user.product, "productss");
    const product = user.product
      .filter((res) => productId === res.toString())
      .toString();
    const updateProduct = await Product.findByIdAndUpdate(product);
    console.log(updateProduct, "updateProduct");

    (updateProduct.name = name),
      (updateProduct.title = title),
      (updateProduct.offers = offers._id),
      (updateProduct.ratingAndReview = ratingAndReview._id),
      (updateProduct.image = productImage.secure_url);

    await updateProduct.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updateProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to update product please try again",
    });
  }
};

module.exports.getAllProdcuts = async (req, res) => {
  try {
    const getProdcuts = await Product.find({}).populate("offers");
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: getProdcuts,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Unalbe to fetch products",
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { email, productId } = req.body;

    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    console.log(productId, email, "productId");
    const product = await Product.findByIdAndDelete({ _id: productId });

    const updateUser = await User.findOneAndUpdate(
      { email },
      { $pull: { product: productId } },
      { new: true }
    );
    console.log(updateUser, "updateUser");

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
      data: updateUser,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Unalbe to delete product",
    });
  }
};

