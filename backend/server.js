const express = require("express");
const dotenv = require("dotenv");
const socketIO = require("socket.io");

// Load environment variables early
dotenv.config();

// DB connection
const connectDB = require("./config/db");
connectDB();
const path = require("path")

// Import routes and middleware

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


//--------------------Deployment--------------------------

  const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get(/.*/, (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}







//--------------------Deployment--------------------------

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Socket.IO setup
const io = socketIO(server, {   //socket means particular User
  pingTimeout: 60000,   
  cors: {
    origin: "http://localhost:3000",
  },
});

// Socket events
io.on("connection", (socket) => {  // io means the whole grp of User
  console.log("Connected to socket.io");

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
});

socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User joined room:", room);
});

socket.on('typing',(room)=>socket.in(room).emit("typing"))
socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))

socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;
        socket.in(user._id).emit("msg received", newMessageReceived);
    });
});

    socket.on("delete message", ({ messageId, chatId }) => {
    io.in(chatId).emit("message deleted", {messageId});
});

  socket.off('setup',()=>{
     console.log("User disconnected");
     socket.leave(userData._id)
     
  })
  

});
