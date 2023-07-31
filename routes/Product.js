const express = require("express");
const { createOffer } = require("../controllers/Offers");
const { createProduct, updateProduct, getAllProdcuts, deleteProduct } = require("../controllers/Product");

const router = express.Router()

// Product Routes
router.post("/add-product" , createProduct)
router.put("/update-product" , updateProduct)
router.get("/getAllProducts" , getAllProdcuts)
router.delete("/deleteProduct" , deleteProduct)
    

// Offer Routes

router.post("/createOffer" , createOffer)

// Product Routes

module.exports = router;