const mongoose = require("mongoose");
const { mailer } = require("../utils/mailer");
const { verifyEmail } = require("../mail/verifyEmail")

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

async function sendVerificationEmail(otp, email) {
    try {
        await mailer(email, "Email Verification | StudyNotion", verifyEmail(otp))
    } catch (err) {
        console.log(err.message);
    }
}

otpSchema.pre("save", async function () {
    if (this.isNew) {
        await sendVerificationEmail(this.otp, this.email)
    }
})

const Otp = mongoose.model("Otp", otpSchema)
module.exports = Otp