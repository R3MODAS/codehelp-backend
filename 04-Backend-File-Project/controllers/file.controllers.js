const File = require("../models/file.models")

// localFileUpload -> Handler function

exports.localFileUpload = async (req, res) => {
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded")
        }

        // getting the file
        const file = req.files.file
        console.log(file)

        // creating the path
        let path = __dirname + "/files/" + Date.now()

        // using the mv() method to place the file somewhere in the server
        file.mv(path, (err) => {
            if (err) return res.status(500).send(err)
        })

        res.status(200).json({
            success: true,
            message: "Local File Uploaded successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}