const mongoose = require("mongoose")

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

// Function to send emails
async function sendVerificationEmail (){
    
}

otpSchema.pre()
otpSchema.pre()

module.exports = mongoose.model("Otp", otpSchema);