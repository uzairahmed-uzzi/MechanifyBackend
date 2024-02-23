const asyncHandler=require('express-async-handler')
const otp=require('../schemas/otpSchema')
const otpGenerator = require('otp-generator')
const twilio = require('twilio')
const sid=process.env.TWILIO_ACCOUNT_SID
const authtoken=process.env.TWILIO_AUTH_TOKEN

const client =new twilio.Twilio(sid,authtoken)

exports.sendOtp=asyncHandler(async(req,res)=>{
    const {userid,phoneNum}=req.body
    if(!phoneNum || !userid){
        res.status(400)
        throw new Error('Required fields are missing')
    }
    
    const isExist=await otp.findOne({phoneNum,userid})
    if(isExist){
        res.status(400)
        throw new Error('OTP already sent new one will be send in 30 minutes')
    }
    const code = otpGenerator.generate(6)
//     client.verify.v2
//   .services(process.env.verifySid)
//   .verifications.create({ to: "+923223591811", channel: "sms" })
//   .then((verification) => console.log(verification.status))
//   .then(() => {
//     const readline = require("readline").createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     readline.question("Please enter the OTP:", (otpCode) => {
//       client.verify.v2
//         .services(verifySid)
//         .verificationChecks.create({ to: "+923223591811", code: otpCode })
//         .then((verification_check) => console.log(verification_check.status))
//         .then(() => readline.close());
//     });
//   });
    await client.messages.create(
        {
            body:`Your OTP for changing password is ${code}`,
            to:phoneNum,
            from:process.env.PHONE_NUM
        }
        )
    const otps = await otp.create({userid,phoneNum,otp:code})
    res.status(200).json({
        message: "OTP sent succesfully !!..",
        data: otps,
        status: true,
    })
})
exports.verifyOtp=asyncHandler(async(req,res)=>{
    const {id,phoneNum,otp}=req.body
    if( !id || !phoneNum || !otp){
        res.status(400)
        throw new Error('Required fields are missing')
    }
    const otps = await otp.findOne({phoneNum,otp})
    if(!otps){
        res.status(400)
        throw new Error('Invalid OTP')
    }

    res.status(200).json({
        message: "OTP verified succesfully !!..",
        data: otps.userid,
        status: true,
    })
     
})