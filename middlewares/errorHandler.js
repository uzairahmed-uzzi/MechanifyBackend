const {constants} = require('../constants')
exports.errorHandler=(err,req,res,next)=>{
    const statusCode = req.statusCode ? req.statusCode : 500
    title=""
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            title="Validation Error"
            break;
        case constants.UNAUTHORIZED:
            title="UnAuthorized"
            break;
        case constants.NOT_FOUND:
            title="Not Found"
            break;
        case constants.SERVER_ERROR:
            title="Server Error"
            break;
        case constants.FORBIDDEN:
            title="Forbidden"
            break;
        default:
            console.log("no error",statusCode)
            break;
    }
    res.status(statusCode).json({title,message:err.message,stackTrace:err.stack}) 
}