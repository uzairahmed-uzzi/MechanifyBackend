const mongoose = require('mongoose')

const pushNotificationSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    fcm_token:{
        type:String,
        required:true
    },
},{
    timestamps:true
})
module.exports = mongoose.model('PushNotification',pushNotificationSchema)