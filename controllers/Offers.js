const Offers = require("../models/Offers");
const Product = require("../models/Product");
const User = require("../models/User");

module.exports.createOffer = async (req , res) => {
    try {
        const {email , productId , offerDescription} = req.body;
        const addOffer = await Offers.create({
            offerDescription 
        })

        console.log(addOffer , "addOffer")


        await Product.findByIdAndUpdate({_id : productId} , {$push : {offers : addOffer._id}} , {new :true})
        res.status(200).json({
            success : true,
            message : "Offer Created Successfully"
        })

    } catch (error) {
        console.log(error , "createOffer Error")
        return res.status(404).json({
            success : false,
            message : "Unable to create offers , please try again"
        })
    }
}