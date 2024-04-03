const mongoose = require("mongoose")
const mailer = require("../utils/mailer")
const verifyEmail = require("../mail/verifyEmail")

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

async function sendEmailVerification(email, otp) {
    try {
        const mailResponse = await mailer(email, "Verification email by StudyNotion", verifyEmail(otp))
        console.log("Email sent successfully: ", mailResponse);
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

otpSchema.pre("save", async function(next){
    if (this.isNew) {
        await sendEmailVerification(this.email, this.otp)
    }
    next()
})

const Otp = mongoose.model("Otp", otpSchema)
module.exports = Otp