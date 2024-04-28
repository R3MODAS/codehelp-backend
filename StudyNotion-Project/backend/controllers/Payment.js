const Course = require("../models/Course")
const User = require("../models/User")

const { instance } = require("../utils/razorpay");
const { mailer } = require("../utils/mailer")
const { courseEnrollment } = require("../mail/courseEnrollment")

const mongoose = require("mongoose")
const crypto = require("crypto")

// Capture Payment (Create an Order)
exports.capturePayment = async (req, res) => {
    try {
        // get course id from request body
        const { courseId } = req.body

        // get user id from req.user (from auth middleware)
        const userId = req.user.id

        // validation of the data
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course id is required"
            })
        }

        // check if the course exists in the db or not
        const course = await Course.findById({ _id: courseId })
        if (!course) {
            return res.status(400).json({
                success: false,
                message: "Course is not found"
            })
        }

        // check if the user already bought the course or not
        const convertedUserId = new mongoose.Types.ObjectId(userId)
        if (course.studentsEnrolled.includes(convertedUserId)) {
            return res.status(400).json({
                success: false,
                message: "You have already bought this course"
            })
        }

        // create the order
        const amount = course.price
        const currency = "INR"

        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: Math.random(Date.now().toString())
        }

        const paymentDetails = instance.orders.create(options)
        console.log(paymentDetails);

        // return the response
        return res.status(200).json({
            success: true,
            message: "Order is created successfully",
            paymentDetails
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while capturing the payment",
            error: err.message
        })
    }
}

// Verify Signature (Payment is verified or not)
exports.verifySignature = async (req, res) => {
    try {
        // get data from request body
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, courseId } = req.body

        // get user id from req.user (from auth middleware)
        const userId = req.user.id

        // validation of the data
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // verify the signature
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex")

        if (expectedSignature === razorpay_signature) {
            // find the course and add the student to it for enrollment
            const enrolledCourse = await Course.findByIdAndUpdate(
                { _id: courseId },
                {
                    $push: { studentsEnrolled: userId }
                },
                { new: true }
            )

            // validation of the course
            if (!enrolledCourse) {
                return res.status(400).json({
                    success: false,
                    message: "Enrolled course is not found"
                })
            }

            // find the student and add the course to it after enrollment
            const enrolledStudent = await User.findByIdAndUpdate(
                { _id: userId },
                {
                    $push: { courses: courseId }
                },
                { new: true }
            )

            // send the mail
            await mailer(enrolledStudent.email, `Successfully Enrolled into ${enrolledCourse.courseName}`, courseEnrollment(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`))

            // return the reponse
            return res.status(200).json({
                success: false,
                message: "Payment is verified successfully"
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Failed to verify the payment"
            })
        }

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the signature",
            error: err.message
        })
    }
}