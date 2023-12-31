const Offers = require("../models/Offers");
const Product = require("../models/Product");
const User = require("../models/User");

module.exports.createOffer = async (req, res) => {
  try {
    const { productId, offerDescription } = req.body;
    const addOffer = await Offers.create({
      offerDescription,
    });

    await Product.findByIdAndUpdate(
      { _id: productId },
      { $push: { offers: addOffer._id } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Offer Created Successfully",
    });
  } catch (error) {
    console.log(error, "createOffer Error");
    return res.status(404).json({
      success: false,
      message: "Unable to create offers , please try again",
    });
  }
};

module.exports.updateOffer = async (req, res) => {
  try {
    const { productId, offerId, offerDescription } = req.body;
    const product = await Product.findById({ _id: productId });
    const findoffer = product.offers.filter(
      (res) => offerId === res.toString()
    );
    const id = findoffer.toString();

    const update = await Offers.findByIdAndUpdate(
      id,
      { offerDescription: offerDescription },
      { new: true }
    );
    return res.status(200).json({
      success: false,
      message: "Offer Updated Successfully",
      data: update,
    });
  } catch (error) {
    console.log(error, "error update offer");
    return res.status(404).json({
      success: false,
      message: "Unable to update offers , please try again",
    });
  }
};

module.exports.deleteOffer = async (req, res) => {
  try {
    const { productId, offerId } = req.body;
    const product = await Product.findById({ _id: productId });
    const findoffer = product.offers.filter(
      (res) => offerId === res.toString()
    );
    const id = findoffer.toString();
    await Product.findByIdAndUpdate(
      { _id: productId },
      { $pull: { offers: id } }
    );
    await Offers.findByIdAndDelete({ _id: id }, { new: true });
    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.log(error, "createOffer Error");
    return res.status(404).json({
      success: false,
      message: "Unable to delete offers , please try again",
    });
  }
};

module.exports.getProductOffers = async (req, res) => {
  try {
    const {id} = req.params;

    if(!id) {
        return res.status(404).json({
            success : false,
            message : "No product present with this Id"
        })
    }

    const getOffers = await Product.findById({_id : id}).populate("offers").exec()
    const offers = getOffers.offers
    res.status(200).json({
        success : true,
        message : "Offers fetched successfully",
        data : offers
    })
  } catch (error) {
    console.log(error, "createOffer Error");
    return res.status(404).json({
      success: false,
      message: "Unable to delete offers , please try again",
    });
  }
};
