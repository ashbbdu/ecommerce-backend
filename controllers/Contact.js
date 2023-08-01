const { contactUsEmail } = require("../mail/Contact");
const Contact = require("../models/Contact");
const { sendMailer } = require("../utils/MailSender");

module.exports.contactUs = async (req , res) => {
    try {
        const {firstName, lastName , email , contactNumber , message} = req.body;
        
        try {
        const sendMail = await sendMailer("Contact Us Mail" , email , contactUsEmail(firstName, lastName , email , contactNumber , message))
        console.log(sendMail ,"sendMail")
        }
        catch (error) {
            console.log(error)
        }

        const contactUs = await Contact.create({
            firstName, lastName , email , contactNumber , message
        })

        res.status(200).json({
            success : true,
            message : "Form submitted successfully",
            data : contactUs
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success : false,
            message : "Something went wrong"
        })
    }
}