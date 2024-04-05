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
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

// Send the mail before storing the otp to the db
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailer(email, "Email Verification from Studynotion", verifyEmail(otp))
        console.log("Email sent successfully: ", mailResponse);
    } catch (err) {
        console.error(err)
        throw new Error(err)
    }
}

otpSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp)
    }
    next()
})

const Otp = mongoose.model("Otp", otpSchema)
module.exports = Otp

// otpSchema -> otp, email, createdAt (expires)