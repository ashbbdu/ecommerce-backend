const express = require("express");
const { createOffer, updateOffer, deleteOffer, getProductOffers } = require("../controllers/Offers");
const { createProduct, updateProduct, getAllProdcuts, deleteProduct } = require("../controllers/Product");

const router = express.Router()

// Product Routes
router.post("/add-product" , createProduct)
router.put("/update-product" , updateProduct)
router.get("/getAllProducts" , getAllProdcuts)
router.delete("/deleteProduct" , deleteProduct)
    

// Offer Routes

router.post("/createOffer" , createOffer)
router.put("/updateOffer" , updateOffer)
router.delete("/deleteOffer" , deleteOffer)
router.get("/getProductOffers/:id" , getProductOffers)

// Product Routes

module.exports = router;