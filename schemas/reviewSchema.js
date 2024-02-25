const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({    
    rating: {
        type: Number,
        required: [true, "Please provide rating"]
    },
    description: {
        type: String,
        required: [true, "Please provide description"]
    }
},{
    timestamps:true
})

module.exports=mongoose.model('review',reviewSchema)