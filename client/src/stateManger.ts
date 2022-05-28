import {sleep} from "./index";
import {resetPlayGame} from "./playGame";

export enum state {
    PLAYING, WAITING_ON_OPPONENT, CHOOSING
}

let currentState = state.CHOOSING;

let infoText = "";

const roomStateTextDiv = document.getElementById("roomStateText")! as HTMLElement;

const roomDiv = document.getElementById("room")!;
const joinRoomDiv = document.getElementById("joinRoom")!;

export function setState(newState: state) {
    currentState = newState;

    if (currentState != state.CHOOSING) {
        joinRoomDiv.style.display = "none"
        roomDiv.style.display = "block"
    } else {
        joinRoomDiv.style.display = "block"
        roomDiv.style.display = "none"

        resetPlayGame()
    }
}

export function setStateInfo(info: string) {
    infoText = info;
    roomStateTextDiv.innerText = info;
}

export function setShortStateInfo(info: string) {
    roomStateTextDiv.innerText = info;

    sleep(1000).then(() => roomStateTextDiv.innerText = infoText)
}