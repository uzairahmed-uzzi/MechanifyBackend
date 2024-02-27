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

exports.createDeviceToken=asyncHandler(async(req,res)=>{
  const {userId,fcm_token}=req.body
  const push =await pushNotification.create({
    userId:userId,
    fcm_token:fcm_token
  })
  if(!push){
    res.status(400)
    throw new Error("Device token not created")
  }
  res.status(200).json({
    message:"Device token created",
    data:push
  })
})