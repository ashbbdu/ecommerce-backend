const mongoose = require("mongoose");

const Product = new mongoose.Schema({
   name : {
    type: String,
    required: true,
    trim: true,
   },
   title : {
    type: String,
    required: true,
    trim: true,
   }
   ,
   price : {
    type: String,
    required: true,
    trim: true,
   },
   image : {
    type: String,
   //  required: true,
    trim: true, 
   },
   offers : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Offers"
   }],
   userProduct : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
 }]
   ,
   ratingAndReview : [
      {
         type : mongoose.Schema.Types.ObjectId,
         required : true,
         ref : "RatingAndReview"
        }
   ]
});

module.exports = mongoose.model("Product" , Product)