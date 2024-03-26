const nodemailer = require("nodemailer")

const sendEmail = async (email, title, body) => {
    try{
        // Creating a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        // Sending the email
        const info = await transporter.sendMail({
            from: "StudyNotion by Sharadindu Das",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info)
        return info

    }catch(err){
        console.error(err.message)
    }
}

module.exports = sendEmail