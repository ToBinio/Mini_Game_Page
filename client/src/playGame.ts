import {gameTypes} from "./joinGame";
import {RoomInfo} from "../../types/Types";
import {setState, setStateInfo, state} from "./stateManger";
import {Game} from "./games/Game";
import {RockPaperScissor} from "./games/RockPaperScissor";

const possibleGamesUl = document.getElementById("possibleGames")! as HTMLUListElement;
const gameSpaceDiv = document.getElementById("gameSpace")! as HTMLElement;

let currentGame: Game;

export function onSearchingRoom(gamesToPLay: boolean[]) {
    displayPossibleGames(gamesToPLay);

    setState(state.WAITING_ON_OPPONENT)
    setStateInfo("searching for Game")
}

export function onJoinRoom(info: RoomInfo) {
    let gameInfo = document.getElementById("gameInfo")!;
    setStateInfo("joined Room")

    gameInfo.innerText = JSON.stringify(info);

    displayPossibleGames(info.possibleGames)
    setState(state.PLAYING)
}

export function closeRoom() {
    if (currentGame) currentGame.tearDownSocket();

    setState(state.CHOOSING)
    setStateInfo("")
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

export function startGame(type: GameTypes) {
    setStateInfo("Playing " + gameTypes[type])

    if (type == GameTypes.ROCK_PAPER_SCISSOR) {
        currentGame = new RockPaperScissor();
    }

    currentGame.setUpHTML(gameSpaceDiv);
    currentGame.setUpSocket()
}

export enum GameTypes {
    ROCK_PAPER_SCISSOR
}
