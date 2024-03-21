const mongoose = require("mongoose")
const nodemailer = require("nodemailer")

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String
    },
    tags: {
        type: String
    },
    email: {
        type: String
    }
})

fileSchema.post("save", async (doc) => {
    try {
        console.log(doc)

        // transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // send mail
        let info = await transporter.sendMail({
            from: "Sharadindu Das",
            to: doc.email,
            subject: "New File uploaded on cloudinary",
            html: `<h2>Hello</h2><p>File uploaded successfully</p><a href=${doc.url}>${doc.url}</a>`
        })
        console.log(info)
        console.log("Email Sent")
    }
    catch (err) {
        console.log(err)
    }

})

const File = mongoose.model("File", fileSchema)
module.exports = File