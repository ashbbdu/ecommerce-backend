const Product = require("../models/Product");
const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");

module.exports.addRatingAndReview = async (req, res) => {
  try {
    const { email, productId, rating, review } = req.body;
    const user = await User.findOne({ email });
    console.log(user, "user");
    const product = await Product.findById({ _id: productId });
  
    const createRatingAndReview = await RatingAndReview.create({
      user: user._id,
      rating,
      review,
      product: product,
    });
    const updateProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      { $push: { ratingAndReview: createRatingAndReview._id } },
      { new: true }
    ).populate("ratingAndReview");
    res.status(200).json({
        success : true,
        message : "Rating & Review added successfully",
        data : updateProduct.ratingAndReview
    })
  } 
   catch (error) {
    console.log(error)
    return res.status(404).json({
        success : false,
        message : "Unable to create review and rating , please try again"
    })
}
}

module.exports.getReviews = async (req , res) => {
    try {
        const { productId } = req.body;
        
       const product =  await Product.findById({_id : productId}).populate("ratingAndReview").exec();
       res.status(200).json({
        success : true,
        message : "Review and Rating fetched successfully",
        data : product.ratingAndReview
       })
    } catch (error) {
        console.log(error)
    return res.status(404).json({
        success : false,
        message : "Unable to create review and rating , please try again"
    })
    }
}