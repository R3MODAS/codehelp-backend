const File = require("../models/file.models")
const cloudinary = require("cloudinary").v2

// localFileUpload 
exports.localFileUpload = async (req, res) => {
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded")
        }

        // getting the file
        const file = req.files.file
        console.log(file)

        // creating the path
        let path = __dirname + "/files/" + `${file.name}`

        try {
            // using the mv() method to place the file somewhere in the server
            await file.mv(path)

            res.status(200).json({
                success: true,
                message: "Local File Uploaded successfully"
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: "Error moving the file: " + err.message
            });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type)
}

async function uploadFileToCloudinary(file, folder) {
    try {
        return await cloudinary.uploader.upload(file.tempFilePath, { folder });
    } catch (error) {
        throw new Error("Error uploading file to Cloudinary: " + error.message);
    }
}

// imageUpload
exports.imageUpload = async (req, res) => {
    try {
        // fetching data
        const { name, tags, email } = req.body

        // Validating
        if (!name || !tags || !email) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters (name, tags, or email)."
            });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded")
        }

        const file = req.files.imageFile

        const supportedTypes = ["jpg", "jpeg", "png"]
        const fileType = file.name.split(".")[1].toLowerCase()

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "The file format is not supported"
            })
        }

        // file format suported
        const response = await uploadFileToCloudinary(file, "Codehelp")

        const fileData = await File.create({
            name, tags, email, imageUrl: response.secure_url
        })

        return res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image uploaded successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Error uploading the file: " + err.message
        });
    }
}