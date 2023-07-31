const mongoose = require("mongoose");

const Offers = new mongoose.Schema({
    offerDescription : {
        type : "String",
        required : true
    }
});

module.exports = mongoose.model("Offers" , Offers)