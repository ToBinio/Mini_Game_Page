import {socket} from "../index";
import {Player} from "../../../types/Types";
import {currentPlayer, isPlayerA} from "../playGame";
import {RoundBasedGame} from "./prefabs/RoundBasedGame";

export class TickTackToe extends RoundBasedGame {

    private playFieldDiv: HTMLElement | undefined;

    setUpHTML(element: HTMLElement): void {
        this.userScore = document.createElement("div");
        this.userScore.innerText = "0"
        this.userScore.id = "tttScoreUser"

        this.opponentScore = document.createElement("div");
        this.opponentScore.innerText = "0"
        this.opponentScore.id = "tttScoreOpponent"

        this.playFieldDiv = document.createElement("div");
        this.playFieldDiv.id = "tttPlayField"

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                let button = document.createElement("button");

                button.addEventListener("click", () => socket.emit("tttChooseField", [x, y]))

                button.appendChild(document.createElement("div"));

                this.playFieldDiv.appendChild(button);
            }
        }

        element.appendChild(this.userScore)
        element.appendChild(this.playFieldDiv)
        element.appendChild(this.opponentScore)

        this.disablePlayField()
    }

    setUpSocket(): void {
        super.setUpSocket();

        socket.on("tttTurnInfo", (info: { activePlayer: Player, map: FieldState[][] }) => {
            this.updatePlayField(info.map, info.activePlayer)
        })

        socket.on("tttRoundEnded", (cords: number[][]) => {

            for (let i = 0; i < cords.length; i++) {
                let index = cords[i][0] * 3 + cords[i][1];

                this.playFieldDiv!.children.item(index)!.classList.add("tttWinner")
            }

            this.playFieldDiv?.classList.add("tttWinner")
            this.disablePlayField()
        })

        socket.on("tttStartRound", () => {
            this.resetPlayField()
        })
    }

    tearDownSocket(): void {
        super.tearDownSocket()
        socket.removeAllListeners("tttTurnInfo")
        socket.removeAllListeners("tttRoundEnded")
        socket.removeAllListeners("tttStartRound")
    }

    resetAfterGame(): void {
        this.disablePlayField()
    }

    updatePlayField(map: FieldState[][], activePlayer: Player) {
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[x].length; y++) {

                let button = this.playFieldDiv!.children.item(x * map[x].length + y) as HTMLButtonElement;
                button.disabled = true;

                if (map[x][y] == FieldState.EMPTY) {
                    if (activePlayer == currentPlayer) button.disabled = false;
                } else if (map[x][y] == FieldState.PLAYER_A) {
                    button.classList.add(isPlayerA() ? "tttUser" : "tttOpponent")
                } else {
                    button.classList.add(isPlayerA() ? "tttOpponent" : "tttUser")
                }
            }
        }
    }

    disablePlayField() {
        for (let i = 0; i < 9; i++) {
            (this.playFieldDiv!.children.item(i) as HTMLButtonElement).disabled = true;
        }
    }

    resetPlayField() {
        this.playFieldDiv?.classList.remove("tttWinner")

        for (let i = 0; i < 9; i++) {
            let button = this.playFieldDiv!.children.item(i) as HTMLButtonElement;

            button.classList.remove("tttUser")
            button.classList.remove("tttOpponent")
            button.classList.remove("tttWinner")
        }
    }
}

enum FieldState {
    EMPTY, PLAYER_A, PLAYER_B
}