const mongoose = require("mongoose");

const RatingAndReview = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true
    },
    rating : {
        type : String,
        trim : true
    },
    review : {
        type : String,
        trim : true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true
    }

})

module.exports = mongoose.model("RatingAndReview" , RatingAndReview)