const jwt = require("jsonwebtoken")
require("dotenv").config()
module.exports.auth = async (req , res , next) => {
    try {
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        if(!token) {
            return res.status(404).json({
                success : false,
                message : "Token missing"
            })
          
        }
        try {   
            const decode = await jwt.verify(token , process.env.JWT_SECRET)
            console.log("decode" , decode)
            req.user = decode

        } catch (error) {
            return res.status(404).json({
                success : false,
                message : "Invalid Token"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success :false,
            message : "Unable to verify token"
        })
    }
}

