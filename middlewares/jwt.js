const jwt = require('jsonwebtoken')

exports.generateToken = (payload) => {
    const token = jwt.sign(payload,process.env.secret_key)
    return token
}

exports.verifyToken=async(req,res,next)=>{
    const token = req.headers.authorization&&req.headers.authorization.startsWith("Bearer")?req.headers.authorization.split(" ")[1] : false;
    if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
    }
    try {
      const isValid = jwt.verify(token, process.env.secret_key);
      console.log(isValid);
      req.userId = isValid.userId; //Add the decoded payload to the request object
      if (isValid) {
        next();
      } else {
        res.json({ message: "Invalid user" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Something went wrong !!..",
      });
    }
}