const express = require('express');
const router = express.Router();
const {signUp,login,getUser,updateUser,updatePassword} = require('../controllers/userController');
const {verifyToken} = require("../middlewares/jwt");
const { getMechanics } = require('../controllers/mechanicController');
const {sendOtp,verifyOtp} = require('../controllers/otpController');


router.post("/sendOtp",sendOtp);
router.post("/verifyOtp",verifyOtp);
router.post("/signup",signUp);
router.post("/login",login);
router.get("/getuser/:id",verifyToken,getUser);
router.post("/getMechanics",verifyToken,getMechanics);
router.put("/updateuser",verifyToken,updateUser);
router.post('/updatePassword',updatePassword)


module.exports = router;





