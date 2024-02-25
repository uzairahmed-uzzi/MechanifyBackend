const asyncHandler=require('express-async-handler')
const Request=require('../schemas/requestSchema')
const Review = require('../schemas/reviewSchema')
const User = require('../schemas/userSchema')
const _ = require("lodash");


exports.requestMechanic=asyncHandler(async(req,res)=>{
    const {requestor,services,mechanic,description,longitude,latitude,appointment_date_time}=req.body
    if(!requestor||!mechanic || !services || !longitude || !latitude || !appointment_date_time){
        res.status(400)
        throw new Error('Required fields are missing')
    }
    const isExist=await Request.findOne({requestor,services,mechanic,currentStatus:{$in:["pending","inprogress"]},appointment_date_time})
    if(isExist){
        res.status(400)
        throw new Error('Request already exists')
    }
    const request = await Request.create({requestor,services,mechanic,description,longitude,latitude,appointment_date_time})
    res.status(200).json({
        message: "Request created succesfully !!..",
        data: request,
        status: true,
    })
})

exports.getAllRequests=asyncHandler(async(req,res)=>{
    const requestor=req.params.id
   if(!requestor){
       res.status(400)
       throw new Error('Required fields are missing')      
   }
   const requests = await Request.find({requestor:requestor}) 
   if(!requests){
       res.status(400)
       throw new Error('No requests found')      
   }

    const requestWithReviews = await Promise.all(requests.map(async (ele, ind) => {
     try {
         const reviews = await Review.find({ _id: ele.review });
         const mechanic =  await User.find({_id:ele.mechanic})
         const requestor = await User.find({_id:ele.requestor})
         return {
             data: { ..._.omit(ele, 'review')},
             reviews,
             mechanic,
             requestor,
         };
     } catch (error) {
         console.error("Error fetching reviews:", error);
         return {
             data: { ..._.omit(ele, 'review'), reviews: [] } // Return empty array if error occurs
         };
     }
    }));

    

   res.status(200).json({
       message: "Requests fetched succesfully !!..",
       requestWithReviews,
       status: true,
   })
})

exports.getAllRequestsOfMechanics=asyncHandler(async(req,res)=>{
    const mechanic=req.params.id
    if(!mechanic){
        res.status(400)
        throw new Error('Required fields are missing')      
    }
   const requests = await Request.find({mechanic:mechanic}) 
   if(!requests){
       res.status(400)
       throw new Error('No requests found')      
   }
   const requestWithReviews = await Promise.all(requests.map(async (ele, ind) => {
    try {
        const reviews = await Review.find({ _id: ele.review });
        const mechanic =  await User.find({_id:ele.mechanic})
        const requestor = await User.find({_id:ele.requestor})
        return {
            data: { ..._.omit(ele, 'review')}
            , reviews,mechanic,requestor 
        };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return {
            data: { ..._.omit(ele, 'review'), reviews: [] } // Return empty array if error occurs
        };
    }
   }));

   res.status(200).json({
       message: "Requests fetched succesfully !!..",
       requestWithReviews,
       status: true,
   })
})

exports.getRequest=asyncHandler(async(req,res)=>{
  const id=req.params.id
  if(!id){
      res.status(400)
      throw new Error('Required fields are missing')
  }
  
  const request = await Request.findOne({_id:id})  
  if(!request){
      res.status(400)
      throw new Error('No request found')
  }
  const {requestor,mechanic}=request
  const users = await User.find({_id:{$in:[requestor,mechanic]}})
  const requestWithReview =async() =>{
    const reviews=await Review.find({ _id: request.review });
  return {
      data: { ..._.omit(request, 'review'), reviews }
  };
}
  res.status(200).json({
      message: "Request fetched succesfully !!..",
      data: {requestWithReview,users} ,
      status: true,
  })
})

exports.delRequest=asyncHandler(async(req,res)=>{
    const id=req.params.id
    if(!id){
        res.status(400)
        throw new Error('Required fields are missing')
    }   
    const requests = await Request.findByIdAndDelete({_id:id})  
    if(!requests){
        res.status(400)
        throw new Error('Something went wrong...')
    } 
    if(requests.review){
        await Review.findByIdAndDelete({_id:requests.review})
    }
    res.status(200).json({
        message: "Request deleted succesfully !!..",
        data: requests,
        status: true,      
    })
})

exports.updateRequest=asyncHandler(async(req,res)=>{
    const id=req.params.id
    if(!id){
        res.status(400)
        throw new Error('Required fields are missing')
    }
    const {isAccepted,services,currentStatus,description,rating,reviewDescription}=req.body 
    let reviews=[]
    if(rating && reviewDescription){
        reviews = await Review.create({rating,description:reviewDescription})
    }
    const requests = await Request.findByIdAndUpdate({_id:id},{isAccepted,services,currentStatus,description,review:reviews._id},{new:true})  
    if(!requests){
        res.status(400)
        throw new Error('Something went wrong...')
    } 
    
    res.status(200).json({
        message: "Request updated succesfully !!..",
        data: requests,reviews,
        status: true,
        
    })   
})