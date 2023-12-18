require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { Server } = require("socket.io");
const { createServer } = require("node:http");
const SocketServer = require("./socketServer");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Socket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  SocketServer(socket);
});

//Routes
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/postRouter"));
app.use("/api", require("./routes/commentRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/notifyRouter"));
app.use("/api", require("./routes/messageRouter"));

//Connect MongoDB

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to my website" });
});

const URI = process.env.MONGODB_URL;
try {
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log("Connect to MongoDB successfully !!!");
} catch (error) {
  console.log("Connect to MongoDB failure !!!");
}

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


