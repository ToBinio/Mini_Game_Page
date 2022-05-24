export enum state {
    PLAYING, WAITING_ON_OPPONENT, CHOOSING
}

let currentState = state.CHOOSING;

let stateInfoDiv = document.getElementById("stateInfo")! as HTMLElement;

let playGameDiv = document.getElementById("playGame")!;
let joinGameDiv = document.getElementById("joinGame")!;

export function setState(newState: state) {
    currentState = newState;

    if(currentState != state.CHOOSING){
        joinGameDiv.style.display = "none"
        playGameDiv.style.display = "block"
    }else{
        joinGameDiv.style.display = "block"
        playGameDiv.style.display = "none"
    }
}

export function setStateInfo(info: string) {
    stateInfoDiv.innerText = info;
}