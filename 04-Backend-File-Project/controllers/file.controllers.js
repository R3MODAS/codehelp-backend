const path = require("path")
const File = require("../models/file.models")
const cloudinary = require("cloudinary").v2

// checks if the file type is supported or not
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type)
}

// uploads the file to cloudinary
async function uploadFileToCloudinary(file, folder, quality, height) {
    try {
        const options = {
            folder,
            resource_type: "auto"
        }

        if (quality && height) {
            options.quality = quality
            options.height = height
        }

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        throw new Error("Error uploading file to Cloudinary: " + error.message);
    }
}

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

        // Extracting the file
        const file = req.files.imageFile
        // const supportedTypes = ["jpg", "jpeg", "png"]
        // const fileType = file.name.split(".")[1].toLowerCase()

        const supportedTypes = [".jpg", ".jpeg", ".png"]
        const fileType = path.extname(file.name).toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "The file format is not supported"
            })
        }

        // file format suported
        const response = await uploadFileToCloudinary(file, "Codehelp")
        console.log(response)

        const fileData = await File.create({
            name, tags, email, url: response.secure_url
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

// videoUpload
exports.videoUpload = async (req, res) => {
    try {
        const { name, email, tags } = req.body
        const MAX_VIDEO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

        if (!name || !email || !tags) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameters (name, tags, or email)."
            })
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files were uploaded"
            })
        }

        const file = req.files.videoFile
        const supportedTypes = [".mp4", ".mov"]
        const fileType = path.extname(file.name).toLowerCase()

        //TODO: add a upper limit of 5MB for video (Done)
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "The file format is not supported"
            })
        }

        // Check file size
        if (file.size > MAX_VIDEO_SIZE_BYTES) {
            return res.status(400).json({
                success: false,
                message: "The file size exceeds the maximum allowed size"
            });
        }

        // File format and size are supported, upload to Cloudinary
        const response = await uploadFileToCloudinary(file, "Codehelp")

        // Create file data in the database
        const fileData = await File.create({
            name, email, tags, url: response.secure_url
        })

        return res.status(200).json({
            success: true,
            videoUrl: response.secure_url,
            message: "Video uploaded successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.imageSizeReducer = async (req, res) => {
    try {
        const { name, tags, email } = req.body

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

        const supportedTypes = [".jpg", ".jpeg", ".png"]
        const fileType = path.extname(file.name).toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "The file format is not supported"
            })
        }

        // TODO: use height attribute (DONE)
        const response = await uploadFileToCloudinary(file, "Codehelp", 30, 300)

        const fileData = await File.create({
            name, tags, email, url: response.secure_url
        })

        return res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image with reduced quality has been uploaded successfully"
        })


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}