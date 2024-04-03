const nodemailer = require("nodemailer")

const mailer = async (email, title, body) => {
    try {
        const transporter = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        const info = transporter.sendMail({
            from: "StudyNotion | Sharadindu Das",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info)
        return info
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = mailer