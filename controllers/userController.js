const asyncHandler = require("express-async-handler");
const userModel = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const {generateToken, verifyToken} = require("../middlewares/jwt");
exports.signUp=asyncHandler(async(req,res)=>{
    const {name,email,password,role,phoneNum}=req.body;

    if(!name || !email || !password){
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
        name,
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
        data: user,
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
   res.status(200).json({
     message: "User retrieved succesfully !!..",
     data: user,
     status: true,
   });
})

exports.updateUser = asyncHandler(async (req, res) => {
   
   const { username, address, latitude, longitude,services,role,phoneNum,appointment_date_time } = req.body;
   // If fields are missing
   if (!username) {
     res.status(400)
     throw new Error( "Required fields are missing") ;
   }

   //update User
   const user = await userModel.findByIdAndUpdate(req.userId,{username,address, latitude, longitude,services,role,phoneNum,appointment_date_time},{new:true});
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