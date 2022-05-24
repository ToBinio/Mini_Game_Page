import {io} from "socket.io-client";
import {GameTypes, RoomInfo} from "../../types/Types";
import {setState, setStateInfo, state} from "./stateManger";

let possibleGamesUl = document.getElementById("possibleGames")! as HTMLUListElement;

let socket = io();

let gameTypes = ["rockPaperScissor"]

let userNameInput = document.getElementById("userNameInput") as HTMLInputElement;

document.getElementById("joinButton")!.addEventListener("click", () => {
    let name = userNameInput.value.trim();

    if (name == "") {
        alert("User name can not be empty")
        return
    }

    socket.emit("joinGameQue", (name))
})

socket.on("joinRoom", (info: RoomInfo) => {
    let gameInfo = document.getElementById("gameInfo")!;
    setStateInfo("joined Room")

    gameInfo.innerText = JSON.stringify(info);

    displayPossibleGames(info.possibleGames)
    setState(state.PLAYING)
})

socket.on("startGame", (type: GameTypes) => {
    setStateInfo("Playing " + gameTypes[type])
})

socket.on("closedGame", () => {
    setState(state.CHOOSING)
    setStateInfo("")
    alert("closed Game")
})

socket.on("searchingGame", (gamesToPLay : boolean[]) => {
    displayPossibleGames(gamesToPLay);
    setState(state.WAITING_ON_OPPONENT)
    setStateInfo("searching for Game")
})

window.addEventListener("beforeunload", () => {
    socket.emit("disconnect")
})

let chooseGameUl = document.getElementById("chooseGames")!;

for (let i = 0; i < gameTypes.length; i++) {
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox"

    checkBox.addEventListener("click", () => {
        if (checkBox.checked) {
            socket.emit("addGameToPlay", i)
        } else {
            socket.emit("removeGameToPlay", i)
        }
    })

    chooseGameUl.innerHTML += gameTypes[i]
    chooseGameUl.innerHTML += " : "
    chooseGameUl.appendChild(checkBox)
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