const express = require("express");
const { createOffer, updateOffer, deleteOffer, getProductOffers } = require("../controllers/Offers");
const { createProduct, updateProduct, getAllProdcuts, deleteProduct } = require("../controllers/Product");
const { addRatingAndReview, getReviews } = require("../controllers/RatingAndReview");
const { auth } = require("../middlewares/auth");

const router = express.Router()

// Product Routes
router.post("/add-product" , createProduct)
router.put("/update-product" , updateProduct)
router.get("/getAllProducts" , getAllProdcuts)
router.delete("/deleteProduct" , deleteProduct)
    

// Offer Routes

router.post("/createOffer" , auth , createOffer)
router.put("/updateOffer" , updateOffer)
router.delete("/deleteOffer" , deleteOffer)
router.get("/getProductOffers/:id" , getProductOffers)

// ReviewAndRating Routes
router.post("/addReviewAndRating" , addRatingAndReview)
router.get("/getReviewAndRating" , getReviews)

module.exports = router;