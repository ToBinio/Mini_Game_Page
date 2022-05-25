export enum state {
    PLAYING, WAITING_ON_OPPONENT, CHOOSING
}

let currentState = state.CHOOSING;

const stateInfoDiv = document.getElementById("stateInfo")! as HTMLElement;
const gameSpaceDiv = document.getElementById("gameSpace")! as HTMLElement;

const playGameDiv = document.getElementById("playGame")!;
const joinGameDiv = document.getElementById("joinGame")!;

export function setState(newState: state) {
    currentState = newState;

    if (currentState != state.CHOOSING) {
        joinGameDiv.style.display = "none"
        playGameDiv.style.display = "block"
    } else {
        joinGameDiv.style.display = "block"
        playGameDiv.style.display = "none"
        gameSpaceDiv.innerHTML = "";
    }
}

export function setStateInfo(info: string) {
    stateInfoDiv.innerText = info;
}