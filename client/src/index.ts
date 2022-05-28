import {io} from "socket.io-client";
import {GameTypes, RoomInfo} from "../../types/Types";
import {closeRoom, gameEnd, onJoinRoom, onNextGameOpinion, onSearchingRoom, startGame} from "./playGame";

export const socket = io();

socket.on("joinedRoom", (info: RoomInfo) => onJoinRoom(info))

socket.on("startGame", (type: GameTypes) => startGame(type))

socket.on("closedRoom", () => closeRoom())

socket.on("startSearchingRoom", (gamesToPLay: boolean[]) => onSearchingRoom(gamesToPLay))

socket.on("nextGameOpinion", (opinion: boolean) => onNextGameOpinion(opinion))

socket.on("gameEnd", (scores: number[]) => gameEnd(scores))

window.addEventListener("beforeunload", () => {
    socket.emit("disconnect")
})

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function popAnimation(element: HTMLElement) {
    element.classList.add("popAnimation")
    sleep(1000).then(() => element.classList.remove("popAnimation"))
}

export function smallPopAnimation(element: HTMLElement) {

    element.classList.add("smallPopAnimation")
    sleep(600).then(() => element.classList.remove("smallPopAnimation"))
}