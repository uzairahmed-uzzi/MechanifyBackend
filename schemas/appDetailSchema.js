const mongoose = require('mongoose')

const appDetailSchema = new mongoose.Schema({
    privacyPolicy:{
        type:String
    },
    termsAndConditions:{
        type:String
    },
    aboutUs:{
        type:String
    },
    info:{
        type:String
    },
    contactUs:{
        type:String
    },
    shareableLink:{
        type:String,
        default:"www.xyz.com"
    }
})

module.exports =  mongoose.model('AppDetail',appDetailSchema)