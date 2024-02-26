const asyncHandler = require("express-async-handler");
const userModel = require("../schemas/userSchema");
const Review = require("../schemas/reviewSchema");
const Request = require("../schemas/requestSchema");
const bcrypt = require("bcrypt");
const {generateToken, verifyToken} = require("../middlewares/jwt");
const _ = require("lodash");
const cloudinary = require('cloudinary').v2;



// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dmv6xucum',
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});


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
    const token =await generateToken({userId:user._id,email:user.email,role:user.role})
    res.status(200).json({
        message:"User created",
        data: _.omit(user._doc, password),
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
        email:user.email,
        role:user.role
      };
      const token = await generateToken(tokenObj);
      // User get
      let {password,...others}=user._doc
      res.status(200).json({
        message: "User logged in succesfully !!..",
        data: others,
        token,
        status: true,
      });
    }
})

exports.getUser = asyncHandler(async (req, res) => {
    const id= req.params.id
    let user = await userModel.findOne({_id:id});
   // const user = await userModel.find();
   if (!user) {
     res.status(404)
     throw new Error( "User not found") ;
   }
   user = user._doc
   let avgRating=0.0;
   let requests =[]
   let review=[]
   if(user.role == "Mechanic"){
    requests = await Request.find({mechanic:user._id})
    console.log(requests)
    if(requests){
      let ratings = 0;
      let counter=0
      await Promise.all(requests.map(async (ele) => {
        if (ele && ele.review) {
              review = await Review.find({ _id: ele.review });
              ratings += review[0].rating;
              counter+=1
          }
      }));
        avgRating = ratings/counter
        avgRating = avgRating.toFixed(2)
       
    }
   }
   let {password,...others}=user
   res.status(200).json({
     message: "User retrieved succesfully !!..",
     data: {others,avgRating,requests,review},
     status: true,
   });
})

exports.updateUser = asyncHandler(async (req, res) => {
   
   const { username, latitude, longitude,services,role,phoneNum,appointment_date_time } = req.body;
   // If fields are missing
  //  if (!username) {
  //    res.status(400)
  //    throw new Error( "Required fields are missing");
  //  }
  const imageData = req.body.image;

  // Upload image to Cloudinary
  const img = await cloudinary.uploader.upload(imageData, {
    resource_type: 'image'
  });  
   if(!img){

       res.status(400)
       throw new Error( "Image not uploaded")
   }
  

   //update User
   const user = await userModel.findByIdAndUpdate(req.userId,{username, latitude, longitude,services,role,phoneNum,appointment_date_time,image:img.secure_url},{new:true});
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
        data: _.omit(user._doc, password),
        status: true,
        token
    })
})

exports.changePassword=asyncHandler(async(req,res)=>{
  const {previousPassword, newPassword} = req.body

   // If fields are missing
   if (!req.userId || !previousPassword || !newPassword) {
    res.status(400)
    throw new Error("Required fields are missing");
  }

  // Find the user by ID
  const User = await userModel.findById(req.userId);

  // If user not found
  if (!User) {
    res.status(400)
    throw new Error("User not found");
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordMatch = await bcrypt.compare(previousPassword, User.password);

  if (!isPasswordMatch) {
    res.status(400)
    throw new Error("Incorrect password");
  }

  const hashedPassword = await bcrypt.hash(newPassword,10)
  const user = await userModel.findByIdAndUpdate(req.userId,{password:hashedPassword},{new:true})
  
   res.status(200).json({
      message: "Password updated succesfully !!..",
      // data: _.omit(user._doc, password),
      status: true,
      
  })
})

exports.deleteUser = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // If fields are missing
  if (!req.userId || !password) {
    res.status(400)
    throw new Error("Required fields are missing");
  }

  // Find the user by ID
  const User = await userModel.findById(req.userId);

  // If user not found
  if (!User) {
    res.status(400)
    throw new Error("User not found");
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordMatch = await bcrypt.compare(password, User.password);

  if (!isPasswordMatch) {
    res.status(400)
    throw new Error("Incorrect password");
  }

    //delete User
    const user = await userModel.findByIdAndDelete(req.userId);
    if(user.role == "Mechanic"){
        const requests= Request.find({mechanic:user._id})
        requests.map(async(ele,ind)=>{
            const rev=await Review.deleteMany({_id:ele.review})
            console.log(rev)
        })
    }
    res.status(200).json({
      message: "User deleted succesfully !!..",
      // data: _.omit(user, password),
      status: true,
    });
 
 })

 