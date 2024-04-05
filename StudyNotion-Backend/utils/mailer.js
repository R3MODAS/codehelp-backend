const nodemailer = require("nodemailer")

const mailer = async (email,title,body) => {
    try{
        // create a transporter
        const transporter = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // send the mail using the transporter
        const info = transporter.sendMail({
            from: "StudyNotion | Sharadindu Das",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log(info)
        return info

    }catch(err){
        console.error(err)
    }
}

module.exports = mailer