import {gameNames} from "./joinGame";
import {Player, RoomInfo} from "../../types/Types";
import {setState, setStateInfo, state} from "./stateManger";
import {Game} from "./games/Game";
import {RockPaperScissor} from "./games/RockPaperScissor";
import {sleep, smallPopAnimation, socket} from "./index";
import {TickTackToe} from "./games/TickTackToe";

const possibleGamesDiv = document.getElementById("possibleGames")! as HTMLUListElement;
const gameSpaceDiv = document.getElementById("gameSpace")! as HTMLElement;

const userScoreSpan = document.getElementById("userScore")! as HTMLElement;
const opponentScoreSpan = document.getElementById("opponentScore")! as HTMLElement;

const nextGameButton = document.getElementById("nextGame")! as HTMLButtonElement;

let currentGame: Game;
export let currentPlayer: Player;

export let opponentName: string;

export function isPlayerA(): boolean {
    return currentPlayer == 0;
}

export function onSearchingRoom(gamesToPLay: boolean[]) {
    displayQueuedGamed(gamesToPLay);

    setState(state.WAITING_ON_OPPONENT)
    setStateInfo("searching for Game")
}

export function onJoinRoom(info: RoomInfo) {
    setStateInfo("joined Room")

    currentPlayer = info.whichPLayer;

    opponentName = isPlayerA() ? info.names.playerB : info.names.playerA
    document.getElementById("opponentName")!.innerText = opponentName;


    displayPossibleGames(info.possibleGames)
    setState(state.PLAYING)
}

export function closeRoom() {
    if (currentGame) currentGame.tearDownSocket();

    setState(state.CHOOSING)
    setStateInfo("")

    alert("closed Room")
}

function displayQueuedGamed(queuedGames: boolean[]) {
    possibleGamesDiv.innerHTML = "";

    for (let i = 0; i < queuedGames.length; i++) {
        if (queuedGames[i]) {
            let element = document.createElement("span");
            element.innerText = gameNames[i];
            possibleGamesDiv.appendChild(element)
        }

    }
}

function displayPossibleGames(possibleGame: GameTypes[]) {
    possibleGamesDiv.innerHTML = "";

    for (let i = 0; i < possibleGame.length; i++) {
        let element = document.createElement("span");
        element.innerText = gameNames[possibleGame[i]];
        possibleGamesDiv.appendChild(element)
    }
}

export function gameEnd(score: number[]) {
    let newOpponentScore = String(isPlayerA() ? score[1] : score[0]);
    let newUserScore = String(isPlayerA() ? score[0] : score[1]);

    if (opponentScoreSpan.innerText != newOpponentScore) {
        opponentScoreSpan.innerText = newOpponentScore;

        smallPopAnimation(opponentScoreSpan)
    }

    if (userScoreSpan.innerText != newUserScore) {
        userScoreSpan.innerText = newUserScore;

        smallPopAnimation(userScoreSpan)
    }

    nextGameButton.disabled = false
    smallPopAnimation(nextGameButton)
}

export async function startGame(type: GameTypes) {

    gameSpaceDiv.classList.add("fadeOutFadeIn")

    await sleep(1000)

    gameSpaceDiv.innerText = ""
    nextGameButton.classList.remove("chosen")

    nextGameButton.disabled = true

    if (currentGame) currentGame.tearDownSocket()

    setStateInfo("Playing " + gameNames[type])

    if (type == GameTypes.ROCK_PAPER_SCISSOR) {
        currentGame = new RockPaperScissor();
    } else if (type == GameTypes.TIK_TAK_TOE) {
        currentGame = new TickTackToe();
    }

    currentGame.setUpHTML(gameSpaceDiv);
    currentGame.setUpSocket()

    await sleep(1000)

    gameSpaceDiv.classList.remove("fadeOutFadeIn")
}

nextGameButton.addEventListener("click", () => {
    socket.emit("nextGame")
})

export function onNextGameOpinion(opinion: boolean) {
    if (opinion) {
        nextGameButton.classList.add("chosen")
    } else {
        nextGameButton.classList.remove("chosen")
    }
}

export function resetPlayGame() {
    gameSpaceDiv.innerHTML = "";

    userScoreSpan.innerText = "";
    opponentScoreSpan.innerText = "";

    nextGameButton.classList.remove("chosen")
}

export enum GameTypes {
    ROCK_PAPER_SCISSOR, TIK_TAK_TOE
}
