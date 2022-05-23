import {io} from "socket.io-client";

let socket = io();

socket.emit("addGameToPlay", 0)
socket.emit("joinGameQue")

socket.on("joinedGame", (type) => {
    alert("you joined " + type)
})

//todo on close