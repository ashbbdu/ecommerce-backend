const User = require("../models/User");


module.exports.updateProfile = async (req , res) => {
    try {
        const {gender , dateOfBirth , about , contactNumber} = req.body
        const id = req.user.id;
        const profileDetails = await User.findById({_id : id}).populate("additionalDetails")
        const details = profileDetails.additionalDetails
        console.log(details , "details")
        console.log(id , "ashishId")

        details.gender = gender,
        details.dateOfBirth = dateOfBirth,
        details.about = about,
        details.contactNumber = contactNumber;

        await details.save()

        res.status(200).json({
            success :true,
            message : 'Profile Updated Successfully,',
            data : details
        })

     
    } 
    catch (e) {

    }
}