const mongoose = require("mongoose")
const sendEmail = require("../utils/mailer")
const verifyEmailTemplate = require("../mail/emailVerification")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await sendEmail(email, "Verification Email from StudyNotion", verifyEmailTemplate(otp))
        console.log("Email sent successfully!", mailResponse)
    }catch(err){
        console.log("Error while sending mail OTP! ",err);
        throw new Error(err)
    }
}

otpSchema.pre("save", async(next) => {
    // Only send an email when a new document is created
    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp)
    }
})

const Otp = mongoose.model("Otp", otpSchema)
module.exports = Otp