const nodemailer = require("nodemailer")

exports.mailer = async (email, title, body) => {
    try {
        // create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // send the mail
        const response = await transporter.sendMail({
            from: "Sharadindu Das | StudyNotion",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        return response
    } catch (err) {
        console.log(err.message);
    }
}