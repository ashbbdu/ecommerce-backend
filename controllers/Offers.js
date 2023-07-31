const Offers = require("../models/Offers");
const Product = require("../models/Product");
const User = require("../models/User");

module.exports.createOffer = async (req , res) => {
    try {
        const { productId , offerDescription} = req.body;
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

module.exports.updateOffer = async (req , res) => {
    try {
        const {productId , offerId , offerDescription} = req.body;
        const product = await Product.findById({_id : productId})
        const findoffer = product.offers.filter(res => offerId === res.toString())
        const id = findoffer.toString()

        const update = await Offers.findByIdAndUpdate(id , {offerDescription : offerDescription} ,{new :true})
        return res.status(200).json({
            success : false,
            message : "Offer Updated Successfully",
            data : update
        })


    } catch (error) {
        console.log(error , "error update offer")
        return res.status(404).json({
            success : false,
            message : "Unable to update offers , please try again"
        })
    }
}

// module.exports.deleteOffer = async (req , res) => {
//     try {

//     } catch (error) {

//     }
// }