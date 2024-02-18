const express = require('express');
const router = express.Router();
const {signUp,login,getUser,updateUser,updatePassword,deleteUser} = require('../controllers/userController');
const {verifyToken, verifyTokenForAdmin} = require("../middlewares/jwt");
const { getMechanics } = require('../controllers/mechanicController');
const {sendOtp,verifyOtp} = require('../controllers/otpController');
const { getAllUsersByAdmin,getUserByAdmin, addUserByAdmin, updateUserByAdmin, deleteUserByAdmin } = require('../controllers/adminController');


router.post("/sendOtp",sendOtp);
router.post("/verifyOtp",verifyOtp);
router.post("/signup",signUp);
router.post("/login",login);
router.get("/getuser/:id",verifyToken,getUser);
router.post("/getMechanics",verifyToken,getMechanics);
router.put("/updateuser",verifyToken,updateUser);
router.post('/updatePassword',updatePassword)
router.delete('/deleteUser',verifyToken,deleteUser)

// admin routes
router.use(verifyTokenForAdmin)

router.get('/getAllUsersByAdmin',getAllUsersByAdmin)
router.get('/getUserByAdmin/:id',getUserByAdmin)
router.post('/addUserByAdmin',addUserByAdmin)
router.put('/updateUserByAdmin/:id',updateUserByAdmin)
router.delete('/deleteUserByAdmin/:id',deleteUserByAdmin)



module.exports = router;





