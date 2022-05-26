import {gameTypes} from "./joinGame";
import {Player, RoomInfo} from "../../types/Types";
import {setState, setStateInfo, state} from "./stateManger";
import {Game} from "./games/Game";
import {RockPaperScissor} from "./games/RockPaperScissor";
import {socket} from "./index";

const possibleGamesUl = document.getElementById("possibleGames")! as HTMLUListElement;
const gameSpaceDiv = document.getElementById("gameSpace")! as HTMLElement;
const roomScoreDiv = document.getElementById("roomScore")! as HTMLElement;

const nextGameButton = document.getElementById("nextGame")! as HTMLButtonElement;

let currentGame: Game;
export let currentPlayer: Player;

export function isPlayerA(): boolean {
    return currentPlayer == 0;
}

export function onSearchingRoom(gamesToPLay: boolean[]) {
    displayPossibleGames(gamesToPLay);

    setState(state.WAITING_ON_OPPONENT)
    setStateInfo("searching for Game")
}

export function onJoinRoom(info: RoomInfo) {
    setStateInfo("joined Room")

    currentPlayer = info.whichPLayer;

    displayPossibleGames(info.possibleGames)
    setState(state.PLAYING)
}

export function closeRoom() {
    if (currentGame) currentGame.tearDownSocket();

    setState(state.CHOOSING)
    setStateInfo("")
    roomScoreDiv.innerText = "0 : 0";

    alert("closed Room")
}

function displayPossibleGames(possibleGame: boolean[]) {

    possibleGamesUl.innerHTML = "";

    for (let i = 0; i < possibleGame.length; i++) {
        if (possibleGame[i]) {
            let element = document.createElement("span");
            element.innerText = gameTypes[i];
            possibleGamesUl.appendChild(element)
        }

    }
}

export function displayScore(score: number[]) {
    roomScoreDiv.innerText = isPlayerA() ? score[0] + " : " + score[1] : score[1] + " : " + score[0];
}

export function startGame(type: GameTypes) {

    gameSpaceDiv.innerText = ""
    if (currentGame) currentGame.tearDownSocket()

    setStateInfo("Playing " + gameTypes[type])

    if (type == GameTypes.ROCK_PAPER_SCISSOR) {
        currentGame = new RockPaperScissor();
    }

    currentGame.setUpHTML(gameSpaceDiv);
    currentGame.setUpSocket()
}

nextGameButton.addEventListener("click", () => {
    socket.emit("nextGame")
})

export enum GameTypes {
    ROCK_PAPER_SCISSOR
}
