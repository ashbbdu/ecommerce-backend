const cookieParser = require("cookie-parser")
const express = require("express")
const cors = require('cors')
const fileUpload =  require("express-fileupload")
const { cloudinaryConnect } = require("./config/cloudinary")
const app = express()
const userRoutes = require("./routes/User")
const productRoutes = require("./routes/Product")
const profileRoutes = require("./routes/Profile")
const contactRoutes = require("./routes/Contact")
require("dotenv").config()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.get("/" , (req , res) => {
    res.send("App is running")
})
app.use(cors())

cloudinaryConnect()

app.use("/api/v1/auth" , userRoutes)
app.use("/api/v1/product" , productRoutes)
app.use("/api/v1/profile" , profileRoutes )
app.use("/api/v1" , contactRoutes )


const connnetWithDb = require("./config/database").connect()


app.listen(PORT , () => {
    console.log(`App Started at ${PORT}`)
})