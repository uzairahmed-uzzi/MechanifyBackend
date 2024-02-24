const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler')

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'Untitled',
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });

  exports.uploadToCloudinary=asyncHandler(async(req, res) => {
    // Extract base64 image data from buffer
    const imageData = req.file.buffer.toString('base64');
  
    // Upload image to Cloudinary
    cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${imageData}`, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
      // Return the Cloudinary URL of the uploaded image
      res.json({ imageUrl: result.secure_url });
    });
  })

