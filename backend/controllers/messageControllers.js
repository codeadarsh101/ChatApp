const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel")


const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id, //loggedIn user..
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage); //create newMsg in DB..

    message = await message.populate("sender", "name pic"); //Replace sender ID → sender details
    message = await message.populate("chat"); // Replace chat ID → chat details
    message = await User.populate(message, {
      //Replace chat.users IDs → user details for everyone in the chat
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    throw new Error(error);
  }
});


const allMessages=asyncHandler(async(req,res)=>{
    try {  
      const messages=await Message.find({chat:req.params.chatId})
      .populate("sender","name email pic").populate("chat")

       res.json(messages)

    } catch (error) {
       throw new Error(error)
    }
})

 const deleteMessage =asyncHandler(async(req,res)=>{
     try {
       const { messageId } = req.params; //from frontend 
       const userId = req.user._id; // logged-in user

       const message =await Message.findById(messageId);

       if(!message){
         return res.status(404).json({
           msg:"Message not found"
         })
       }

      if (message.sender.toString() !== userId.toString()) {  // convert obj-->String..
      return res.status(403).json({ msg: "You can only delete your own message" });
    }

    await Message.findByIdAndDelete(messageId) //remove from DB..
  
    res.status(200).json({ message: "Message deleted", messageId, chatId: message.chat });


     } catch (error) {
        throw new Error(error)
     }
 })



module.exports = {
  sendMessage,
  allMessages,
  deleteMessage
};
