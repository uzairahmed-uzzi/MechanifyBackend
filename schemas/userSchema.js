const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Requestor",
        required: true
    },
    latitude:{
        type:Number,
        
    },
    longitude:{
        type:Number,
        
    },
    services:{
        type: Array,
    },
    phoneNum:{
        type: String,
    },
    image:{
        type:String
    }
},{
    timestamps:true
})

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;