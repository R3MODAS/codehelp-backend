const mongoose = require("mongoose")
const mailSender = require("../utils/mailer")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    otp: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

// Function to send email
async function sendVerificationEmail(email, otp) {
    try{
        const response = mailSender(email, "Verification Email from StudyNotion", otp)
        console.log(`Email sent successfully !`, response)
    }catch(err){
        console.error("Error while sending email: ",err)
        throw new Error(err)
    }
}

otpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp)
    next()
})

module.exports = mongoose.model("Otp", otpSchema);