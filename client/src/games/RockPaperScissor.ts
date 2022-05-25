import {Game} from "./Game";
import {socket} from "../index";
import {Player} from "../../../types/Types";

export class RockPaperScissor extends Game {

    private scoreDiv: HTMLElement | undefined;

    private rockButton: HTMLButtonElement | undefined;
    private paperButton: HTMLButtonElement | undefined;
    private scissorButton: HTMLButtonElement | undefined;

    private opponentDiv: HTMLElement | undefined;

    setUpHTML(element: HTMLElement): void {
        this.scoreDiv = document.createElement("div");
        this.scoreDiv.innerText = "0 : 0";

        let buttonDiv = document.createElement("div");

        this.rockButton = this.createButton(Options.ROCK)
        buttonDiv.appendChild(this.rockButton);

        this.paperButton = this.createButton(Options.PAPER)
        buttonDiv.appendChild(this.paperButton)

        this.scissorButton = this.createButton(Options.SCISSOR)
        buttonDiv.appendChild(this.scissorButton);

        this.opponentDiv = document.createElement("div");

        element.appendChild(this.scoreDiv);
        element.appendChild(buttonDiv);
        element.appendChild(this.opponentDiv)
    }

    setUpSocket(): void {
        socket.on("rpsStartRound", () => {
            this.opponentDiv!.innerText = "";

            this.setButtonState(false)
        })
        socket.on("rpsPlayerWon", (winner: Player) => {
            alert("Player " + winner + " won")

            this.setButtonState(true)
        })
        socket.on("rpsRoundInfo", (info: { opponentOption: Options, ownScore: number, opponentScore: number }) => {
            this.opponentDiv!.innerText = Options[info.opponentOption];
            this.scoreDiv!.innerText = info.ownScore + " : " + info.opponentScore;
        })
    }

    tearDownSocket(): void {
        socket.removeAllListeners("rpsStartRound")
        socket.removeAllListeners("rpsPlayerWon")
        socket.removeAllListeners("rpsRoundInfo")
    }

    createButton(option: Options): HTMLButtonElement {
        let button = document.createElement("button")
        button.innerText = Options[option];

        button.addEventListener("click", () => {
            this.chooseOption(option)
        })

        return button;
    }

    chooseOption(option: Options): void {
        this.setButtonState(true)

        socket.emit("rpsChooseOption", option);
    }

    setButtonState(state: boolean) {
        this.rockButton!.disabled = state
        this.paperButton!.disabled = state
        this.scissorButton!.disabled = state
    }
}

enum Options {
    PAPER, ROCK, SCISSOR
}