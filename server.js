const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let path = require('path');
const bodyParser = require("body-parser");
const cors = require("cors");
const {v4 : uuidv4} = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("node_modules"));
app.use(express.static("styles"));

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) =>{
    res.render("intro", {title: "Group Chat"});
})

app.get("/room", (req, res) =>{
    res.redirect(`/room/${uuidv4()}`)
})

app.get("/room/:room", (req, res) => {
    res.render("room", {roomId: req.params.room});
});

io.on('connection', (socket) => {
    socket.on("join-room", (roomId, userId) =>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
        console.log(userId)

        socket.on("disconnected", () =>{
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
            
        })
    })
})

server.listen(3000, () =>{
    console.log("connected to port 3000")
})