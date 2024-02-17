const asyncHandler=require('express-async-handler')
const Request=require('../schemas/requestSchema')
const User = require('../schemas/userSchema')

exports.requestMechanic=asyncHandler(async(req,res)=>{
    const {requestor,services,mechanic,description,longitude,latitude}=req.body
    if(!requestor||!mechanic || !services || !location ){
        res.status(400)
        throw new Error('Required fields are missing')
    }
    const isExist=await Request.findOne({requestor,services,mechanic,currentStatus:{$in:["pending","inprogress"]}})
    if(isExist){
        res.status(400)
        throw new Error('Request already exists')
    }
    const request = await Request.create({requestor,services,mechanic,description,longitude,latitude})
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
   res.status(200).json({
       message: "Requests fetched succesfully !!..",
       data: requests,
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
   res.status(200).json({
       message: "Requests fetched succesfully !!..",
       data: requests,
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
  res.status(200).json({
      message: "Request fetched succesfully !!..",
      data: {request,users} ,
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
    const {isAccepted,mechanic,services,currentStatus,longitude,latitude,requestor,description}=req.body 
    const requests = await Request.findByIdAndUpdate({_id:id},{isAccepted,mechanic,services,currentStatus,longitude,latitude,requestor,description},{new:true})  
    if(!requests){
        res.status(400)
        throw new Error('Something went wrong...')
    } 
    res.status(200).json({
        message: "Request updated succesfully !!..",
        data: requests,
        status: true,
        
    })   
})