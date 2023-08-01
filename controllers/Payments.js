const Product = require("../models/Product")

exports.capturePayment = async (req, res) => {
    const { product } = req.body
    const userId = req.user.id
    if (product.length === 0) {
      return res.json({ success: false, message: "Please Provide Course ID" })
    }
  
    let total_amount = 0
  
    for (const product_id of product) {
      let product
      try {
        // Find the course by its ID
        product = await Product.findById(product_id)
  
        // If the course is not found, return an error
        if (!product) {
          return res
            .status(200)
            .json({ success: false, message: "Could not find the Course" })
        }
  
        // Check if the user is already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userId)
        if (product.userProduct.includes(uid)) {
          return res
            .status(200)
            .json({ success: false, message: "Product already bought" })
        }
  
        // Add the price of the course to the total amount
        total_amount += product.price
      } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
      }
    }
    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    }
  
    try {
      // Initiate the payment using Razorpay
      const paymentResponse = await instance.orders.create(options)
      console.log(paymentResponse)
      res.json({
        success: true,
        data: paymentResponse,
      })
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ success: false, message: "Could not initiate order." })
    }
  }

  exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  const buyProduct = async (product, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Product ID and User ID" })
    }
  
    for (const productId of product) {
      try {
        // Find the course and enroll the student in it
        const userProduct = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnroled: userId } },
          { new: true }
        )
  
        if (!userProduct) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", userProduct)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const boughtProducts = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              products: productId,
             
            },
          },
          { new: true }
        )
          
        res.status(200).json({
            success : true,
            message : "User Enrolled successfully"
        })

      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }