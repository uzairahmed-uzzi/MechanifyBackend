const mongoose = require('mongoose')

const otpSchema= new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userSchema',
    },
    phoneNum:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    }
},{timestamps:true})
// otpSchema.index({expiresAt: 1}, {expireAfterSeconds: 1800})
otpSchema.index({createdAt: 1}, {expireAfterSeconds: 1800})

module.exports=mongoose.model('otp',otpSchema)