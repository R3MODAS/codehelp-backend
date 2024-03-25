const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        const response = await transporter.sendMail({
            from: "StudyNotion || Sharadindu Das",
            to: email,
            subject: title,
            body: body
        })

        console.log(response)
        return response

    } catch (err) {
        console.error(err.message)
    }
}

module.exports = mailSender