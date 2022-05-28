import * as path from "path";
import * as socketIo from "socket.io";
import {Client} from "./client/Client";

const express = require("express")

const app = express();

const server = require("http").createServer(app);

require("./client/Clients.js");

export const io = new socketIo.Server(server, {
    cors: {
        origin: "*"
    }
})

app.use(express.static(path.join(__dirname, "../client/dist/")))

app.get("", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

server.listen(8080, () => {
    console.log("Server started on Port: 8080");
})

io.on("connect", socket => {
    console.log("socket : " + socket.id + " has connected");
    new Client(socket)
})

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}