import {io} from "socket.io-client";
import {GameTypes, RoomInfo} from "../../types/Types";
import {closeRoom, onJoinRoom, onSearchingRoom, startGame} from "./playGame";

export const socket = io();

socket.on("joinRoom", (info: RoomInfo) => onJoinRoom(info))

socket.on("startGame", (type: GameTypes) => startGame(type))

socket.on("closedRoom", () => closeRoom())

socket.on("searchingRoom", (gamesToPLay: boolean[]) => onSearchingRoom(gamesToPLay))

window.addEventListener("beforeunload", () => {
    socket.emit("disconnect")
})


