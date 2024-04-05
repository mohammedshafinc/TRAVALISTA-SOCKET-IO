require("dotenv").config();

const cors = require("cors");

const mongoose = require("mongoose");
const port = process.env.PORT;
const DB_url = process.env.MONGO_URI;

const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, { cors: { origin: "*" } });

const users = [];
app.use(cors());

mongoose
    .connect(DB_url)
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((err) => {
        console.error("failed to connect mongo db", err);
    });

const { postchats } = require("./controllers/chatcontroller");

io.use(async (socket, next) => {
    socket.userid = socket.handshake.auth.userid;
    next();
}).on("connection", (sokcet) => {
    console.log("a user connected");
    socketId = socket.id;
    const user = { socketid: socketId, userid: socket.userid };
    users.push(user);

    socket.on("sendMessage", (data) => {
        const { message, reciever, sender } = data;
        postchats(message, reciever, sender);
        data.date = new Date();

        const recipient = users.find((user) => user.userid === reciever);

        if (recipient) {
            io.to(recipient.socketid).emit("recievedMessage", data);
        } else {
            console.log("no reciever found");
        }
    });

    socket.on("disconnet", () => {
        console.log(" a user disconnected");

        let index = users.findIndex((e) => e.sockeid === socket.id);

        if (index !== -1) {
            users.splice(index, 1);
        } else {
            console.log("users not found");
        }
        console.log(users, "disconnection");
    });
});

httpServer.listen(port, () => console.log(`listening on ${port}`))
