   const express= require('express');
const { protect } = require('../middleware/authMiddleware');
const {sendMessage,allMessages,deleteMessage}= require("../controllers/messageControllers")

  const router=express.Router();


  router.route('/').post(protect,sendMessage)  //   /api+/message + / => /api/message

   router.route('/:chatId').get(protect,allMessages) 

   router.route('/:messageId').delete(protect,deleteMessage);

  module.exports=router; 