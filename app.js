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
}).on("connection", (socket) => {
    console.log("a user connected");
    const socketId = socket.id;
    const user = { socketid: socketId, userid: socket.userid };
    users.push(user);
    console.log(users);

    socket.on("sendMessage", (data) => {
        console.log(data)
        const { message, reciever, sender } = data;
        console.log('haaai', message, reciever, sender);
        postchats(message, reciever, sender);
        data.date = new Date();

        const recipient = users.find((user) => user.userid === reciever);
        console.log(user)
        console.log(user.userid)
        console.log(reciever)
        console.log('dsfjdsfkldj', recipient)

        if (recipient) {
            io.to(recipient.socketid).emit("recieveMessage", data);
            console.log(data)
        } else {
            console.log("no reciever found");
        }
    });

    socket.on("disconnect", () => {
        
        let index = users.findIndex((e) => e.socketid === socket.id);
        console.log(index);
        console.log(users);
        
        if (index !== -1) {
            console.log(users,'sdfnkdsfdsf')
            users.splice(index, 1);
            console.log(" a user disconnected");
        } else {
            console.log(users, 'else')
            console.log("users not found");
        }
        console.log(users, "disconnection");
    });
});

httpServer.listen(port, () => console.log(`listening on ${port}`))
