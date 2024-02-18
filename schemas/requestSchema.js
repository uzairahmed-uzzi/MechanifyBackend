const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({

    requestor: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: [true,"Please provide a user"]
    },
    latitude: {
        type: Number,
        required: [true, "Please provide latitude"]
    },
    longitude: {
        type: Number,
        required: [true, "Please provide longitude"]
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: [true,"Please provide a user"]
    },
    appointment_date_time:
    {
        type: Date,
        
    },

    currentStatus: {
        type: String,
        default: "pending"
    },
    services: {
        type: Array,
        required: [true,"Please provide a service"]
    },
    description:{
        type:String
    },
    review:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
    }
},{
    timestamps:true,
})

module.exports=mongoose.model('request',requestSchema)