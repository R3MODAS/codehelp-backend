const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let response = await transporter.sendMail({
            from: "StudyNotion || Sharadindu Das",
            to: email,
            subject: title,
            html: body
        })

        console.log(response)
        return response

    } catch (err) {
        console.log(err.message)
    }
}