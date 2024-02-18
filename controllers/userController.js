const asyncHandler = require("express-async-handler");
const userModel = require("../schemas/userSchema");
const Review = require("../schemas/reviewSchema");
const bcrypt = require("bcrypt");
const {generateToken, verifyToken} = require("../middlewares/jwt");
const _ = require("lodash");


exports.signUp=asyncHandler(async(req,res)=>{
    const {username,email,password,role,phoneNum}=req.body;

    if(!username || !email || !password){
        res.status(400)
        throw new Error("Please add all fields")
    }
    const isExist = await userModel.findOne({email})
    if(isExist){
        res.status(400)
        throw new Error("User already exist")
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await userModel.create({
        username,
        email,
        password:hashedPassword,
        role,
        phoneNum
    })
    const token =await generateToken({userId:user._id,email:user.email})
    res.status(200).json({
        message:"User created",
        data: _.omit(user, password),
        token,
        status: true
    })
})

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = await req.body;
     // Check for missing fields
     if (!email || !password ) {
      res.status(400)
      throw new Error("Required fields are missing" );
      
    }
    // find user
    const user = await userModel.findOne({ email });

    if(!user){
      res.status(400)
      throw new Error( "User not exist !!" );
    }

    // Verify Password
    const verifyHash = await bcrypt.compare(password, user.password);
   if (!verifyHash) {
      res.status(400)
      throw new Error( "Crendentials error" );
    }
    if (verifyHash) {
      const tokenObj = {
        userId:user._id,
      };
      const token = await generateToken(tokenObj);
      // User get
      res.status(200).json({
        message: "User logged in succesfully !!..",
        data: _.omit(user, password),
        token,
        status: true,
      });
    }
})



exports.getUser = asyncHandler(async (req, res) => {
    const user = await userModel.findOne({_id:req.userId});
   // const user = await userModel.find();
   if (!user) {
     res.status(404)
     throw new Error( "User not found") ;
   }
   let avgRating=0.0;
   if(user.role == "mechanic"){
    const requests = await Request.find({mechanic:user._id})
    if(requests){
        ratings=0
        requests.map(async(ele)=>{
            const review = await Review.find({ _id: ele.review });
            ratings +=review.rating
        })
        avgRating = ratings/requests.length
       
    }
   }
   res.status(200).json({
     message: "User retrieved succesfully !!..",
     data: {..._.omit(user, password),avgRating},
     status: true,
   });
})

exports.updateUser = asyncHandler(async (req, res) => {
   
   const { username, latitude, longitude,services,role,phoneNum,appointment_date_time } = req.body;
   // If fields are missing
   if (!username) {
     res.status(400)
     throw new Error( "Required fields are missing") ;
   }

   //update User
   const user = await userModel.findByIdAndUpdate(req.userId,{username, latitude, longitude,services,role,phoneNum,appointment_date_time},{new:true});
   if (!user) {
     res.status(400)
     throw new Error( "User not found") ;
   }

   res.status(200).json({
     message: "User updated succesfully !!..",
     data: user,
     status: true,
   });

})


exports.updatePassword=asyncHandler(async(req,res)=>{
    const {userid,password}=req.body
    if(!password || !userid){
        res.status(400)
        throw new Error('Required fields are missing')
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await userModel.findByIdAndUpdate(userid,{password:hashedPassword},{new:true})
    if(!user){
        res.status(400)
        throw new Error('User not found')
    }
    const token=await generateToken({userId:user.id,email:user.email})
    res.status(200).json({
        message: "Password updated succesfully !!..",
        data: _.omit(user, password),
        status: true,
        token
    })
})

exports.deleteUser = asyncHandler(async (req, res) => {
   
    // If fields are missing
    if (!req.userId) {
      res.status(400)
      throw new Error( "Required fields are missing") ;
    }
 
    //delete User
    const user = await userModel.findByIdAndDelete(req.userId);
    if (!user) {
      res.status(400)
      throw new Error( "User not found") ;
    }
    if(user.role == "mechanic"){
        const requests= Request.find({mechanic:user._id})
        requests.map(async(ele,ind)=>{
            const rev=await Review.deleteMany({_id:ele.review})
            console.log(rev)
        })
    }
    res.status(200).json({
      message: "User deleted succesfully !!..",
      data: _.omit(user, password),
      status: true,
    });
 
 })

 