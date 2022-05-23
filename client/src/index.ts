import {io} from "socket.io-client";

let socket = io();

socket.emit("addGameToPlay", 0)
socket.emit("joinGameQue")

socket.on("joinedGame", (type) => {
    alert("you joined " + type)
})

socket.on("closedGame", () => {
    alert("closed Game")
})

window.addEventListener("beforeunload", () => {
    socket.emit("disconnect")
})

//todo on close