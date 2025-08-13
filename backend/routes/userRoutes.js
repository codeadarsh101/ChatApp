
const express = require("express");
const {registerUser,authUser,allUsers} = require('../controllers/userControllers');
const { protect } = require("../middleware/authMiddleware");
const router = express.Router()

// we can handle multiple method..
 router.route('/').post(registerUser).get(protect,allUsers)  // protected by middleware(protect)


// we handle one method here..
 router.post('/login',authUser) 

 
 
module.exports=router