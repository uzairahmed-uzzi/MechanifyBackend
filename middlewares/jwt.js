const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

exports.generateToken = (payload) => {
    const token = jwt.sign(payload,process.env.secret_key)
    return token
}
// for simple user
exports.verifyToken=asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization&&req.headers.authorization.startsWith("Bearer")?req.headers.authorization.split(" ")[1] : false;
    if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
    }
    try {
      const isValid =await jwt.verify(token, process.env.secret_key);
      console.log("isValid",isValid);
      req.userId = isValid.userId; //Add the decoded payload to the request object
      if (isValid) {
        next();
      } else {
        console.log("Invalid user");
        res.json({ message: "Invalid user" });
      }
    } catch (err) {
      console.log("--->",err);
      res.status(500).json({
        message: "Something went wrong !!..",
      });
    }
})

//for admin user

exports.verifyTokenForAdmin = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : false;
  if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
  }
  try {
      const decoded = await jwt.verify(token, process.env.secret_key);
      console.log(decoded);
      req.userId = decoded.userId; // Add the decoded payload to the request object
      const userRole = decoded.role; // Assuming the role is included in the JWT payload
      if (userRole !== "admin") {
          return res.status(403).json({ message: "Access Denied: Unauthorized Role" });
      }
      next();
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
  }
});
