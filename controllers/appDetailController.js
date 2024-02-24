const asyncHandler= require('express-async-handler')
const AppDetail = require('../schemas/appDetailSchema')



// Get all AppDetails
exports.getAllAppDetails = asyncHandler(async (req, res) => {
    const appDetails = await AppDetail.find({});
    res.status(200).json({
        message: "AppDetails retrieved successfully!",
        data: appDetails,
        status: true,
    });
});

// Get AppDetail by ID
exports.getAppDetailById = asyncHandler(async (req, res) => {
    const { _id } = req.params; // Assuming you're passing the ID in the URL params
    const appDetail = await AppDetail.findById(_id);
    if (!appDetail) {
        res.status(404);
        throw new Error('AppDetail not found');
    }
    res.status(200).json({
        message: "AppDetail retrieved successfully!",
        data: appDetail,
        status: true,
    });
});

// Add AppDetail
exports.addAppDetail=asyncHandler(async(req,res)=>{
    const {privacyPolicy,termsAndConditions,info,aboutUs,contactUs,shareableLink}=req.body
    if(!privacyPolicy && !termsAndConditions && !info && !aboutUs && !contactUs && !shareableLink){
        res.status(400)
        throw new Error('Required fields are missing')
    }
    const app = await AppDetail.create({privacyPolicy,termsAndConditions,info,aboutUs,contactUs,shareableLink})
    res.status(200).json({
        message: "AppDetail created succesfully !!..",
        data: app,
        status: true,
    })    
})

// Update AppDetail by ID
exports.updateAppDetail = asyncHandler(async (req, res) => {
    const { _id } = req.params; // Assuming you're passing the ID in the URL params
    const { privacyPolicy, termsAndConditions, info, aboutUs, contactUs, shareableLink } = req.body;

    // Check if any required fields are missing
    if (!privacyPolicy && !termsAndConditions && !info && !aboutUs && !contactUs && !shareableLink) {
        res.status(400);
        throw new Error('Required fields are missing');
    }

    // Find the existing AppDetail by ID and update its fields
    const updatedApp = await AppDetail.findByIdAndUpdate(
        _id,
        { privacyPolicy, termsAndConditions, info, aboutUs, contactUs, shareableLink },
        { new: true } // To return the updated document
    );

    if (!updatedApp) {
        res.status(404);
        throw new Error('AppDetail not found');
    }

    res.status(200).json({
        message: "AppDetail updated successfully!",
        data: updatedApp,
        status: true,
    });
});


// Delete AppDetail by ID
exports.deleteAppDetailById = asyncHandler(async (req, res) => {
    const { _id } = req.params; // Assuming you're passing the ID in the URL params
    const deletedApp = await AppDetail.findByIdAndDelete(_id);
    if (!deletedApp) {
        res.status(404);
        throw new Error('AppDetail not found');
    }
    res.status(200).json({
        message: "AppDetail deleted successfully!",
        data: deletedApp,
        status: true,
    });
});