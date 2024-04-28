const { contactUsEmail } = require("../mail/contactUsEmail")
const { feedbackEmail } = require("../mail/feedbackEmail")
const {mailer} = require("../utils/mailer")

exports.contactUs = async (req,res) => {
    try {
        // get data from request body
        const {firstName, lastName, email, contactNumber, message, countryCode} = req.body

        // validation of the data
        if(!firstName || !lastName || !email || !contactNumber || !message || !countryCode){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // send the mail to the user for contact form submission
        await mailer(email, `Contact Form Submitted Successfully | StudyNotion`, contactUsEmail(email, firstName, lastName, message, contactNumber, countryCode))
        
        // send mail to our mail to see contact form submission
        await mailer(process.env.MAIL_USER, `You got some Feedback from StudyNotion`, feedbackEmail(email, firstName, lastName, message, contactNumber, countryCode))

        // return the response
        return res.status(200).json({
            success: true,
            message: "Contact form is submitted successfully"
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the contact mail",
            error: err.message
        })
    }
}