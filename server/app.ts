import * as path from "path";
import * as socketIo from "socket.io";

const express = require("express")

const app = express();

const server = require("http").createServer(app);

export const io = new socketIo.Server(server, {
    cors: {
        origin: "*"
    }
})

app.use(express.static(path.join(__dirname, "../client/build/")))

app.get("", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/public/index.html"))
})

server.listen(8080, () => {
    console.log("Server started on Port: 8080");
})

io.on("connect", socket => {
    console.log("socket : " + socket.id + " has connected");
})