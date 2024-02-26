const asyncHandler =require('express-async-handler')
const userModel = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const _ = require("lodash");
const fs=require('fs')
const path = require('path')
const FCM = require('fcm-node');
const pushNotification = require('../schemas/pushNotification')

exports.sendPushNotification=asyncHandler(async(userid,message)=>{
  const fcm = new FCM(process.env.SERVER_KEY);

  const pushTokens = await pushNotification.find({userId:userid})
  const regIds=[]
  pushTokens.forEach(element => {
    regIds.push(element.fcm_token)
  })

  if(regIds.length > 0){
    const pushMessage={
      registration_ids:regIds,
      content_availbe:true,
      mutable_content:true,
      notification:{
        body:message,
        title:"Mechanify",
        sound:"default",
      }
    }
    fcm.send(pushMessage, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!" + err);

      }
      else {
        console.log("Successfully sent with response: ", response);
      }
    })
  }
})

exports.getAllUsersByAdmin=asyncHandler(async(req,res)=>{
    const users = await userModel.find();
    if (!users) {
      res.status(404)
      throw new Error( "Users not found") ;
    }
    // Exclude the 'password' attribute from each user object
    const sanitizedUsers = users.map(user => {
        return _.omit(user.toJSON(), ['password']);
    });

    res.status(200).json({
        message: "Users retrieved successfully!",
        data: sanitizedUsers,
        status: true,
    });
})

exports.getUserByAdmin = asyncHandler(async (req, res) => {
    const user = await userModel.findOne({_id:req.params.id});
   if (!user) {
     res.status(404)
     throw new Error( "User not found") ;
   }
   res.status(200).json({
     message: "User retrieved succesfully !!..",
     data: _.omit(user, password),
     status: true,
   });
})

exports.addUserByAdmin =  asyncHandler(async(req,res)=>{

    const { username, latitude, longitude,services,role,phoneNum,appointment_date_time,password } = req.body;
    // If fields are missing
    if (!username  || !latitude || !longitude || !services || !role || !phoneNum || !appointment_date_time || !password) {
      res.status(400)
      throw new Error( "Required fields are missing") ;
    }

    const isExist = await userModel.findOne({email})
    if(isExist){
        res.status(400)
        throw new Error("User already exist")
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        latitude,
        longitude,
        services,
        role,
        phoneNum,
        password:hashedPassword
    })

    res.status(200).json({
        message: "User created succesfully !!..",
        data: _.omit(user, password),
        status: true,
    })

})

exports.updateUserByAdmin = asyncHandler(async (req, res) => {
   
   const { username,  latitude, longitude,services,role,phoneNum,appointment_date_time } = req.body;
   // If fields are missing
   if (!username) {
     res.status(400)
     throw new Error( "Required fields are missing") ;
   }

   //update User
   const user = await userModel.findByIdAndUpdate(req.params.id,{username, latitude, longitude,services,role,phoneNum,appointment_date_time},{new:true});
   if (!user) {
     res.status(400)
     throw new Error( "User not found") ;
   }

   res.status(200).json({
     message: "User updated succesfully !!..",
     data: _.omit(user, password),
     status: true,
   });

})

exports.deleteUserByAdmin = asyncHandler(async (req, res) => {
    const id = req.params.id
     // If fields are missing
     if (!id) {
       res.status(400)
       throw new Error( "Required fields are missing") ;
     }
  
     //delete User
     const user = await userModel.findByIdAndDelete(id);
     if (!user) {
       res.status(400)
       throw new Error( "User not found") ;
     }
  
     res.status(200).json({
       message: "User deleted succesfully !!..",
       data: user,
       status: true,
     });
  
  })