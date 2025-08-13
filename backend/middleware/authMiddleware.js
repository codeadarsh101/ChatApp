

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");

const protect =asyncHandler(async(req,res,next)=>{
   let token;

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      try {
        token=req.headers.authorization.split(" ")[1];

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");// use this (req.user) object
        next()

      } catch (error) {
        res.status(401);
        throw new Error("Not valid, token failed");
      }
   }else{
     res.status(401);
     throw new Error("Invalid form of Token")
   }
});

 module.exports={protect};