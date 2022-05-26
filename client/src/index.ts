import {io} from "socket.io-client";
import {GameTypes, Player, RoomInfo} from "../../types/Types";
import {closeRoom, displayScore, onJoinRoom, onSearchingRoom, startGame} from "./playGame";

export const socket = io();

socket.on("joinedRoom", (info: RoomInfo) => onJoinRoom(info))

socket.on("startGame", (type: GameTypes) => startGame(type))

socket.on("closedRoom", () => closeRoom())

socket.on("startSearchingRoom", (gamesToPLay: boolean[]) => onSearchingRoom(gamesToPLay))

socket.on("nextGameOpinion", (data: { who: Player, opinion: boolean }) => {
    alert("Player : " + data.who + " may wants to start next Game opinion : " + data.opinion)
})

socket.on("roomScores", (scores: number[]) => displayScore(scores))

window.addEventListener("beforeunload", () => {
    socket.emit("disconnect")
})


