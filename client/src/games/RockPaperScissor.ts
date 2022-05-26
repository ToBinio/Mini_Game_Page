import {Game} from "./Game";
import {socket} from "../index";
import {Player} from "../../../types/Types";

import rockSvg from '../../images/rockPaperScissor/rock.svg';
import paperSvg from "../../images/rockPaperScissor/paper.svg";
import scissorSvg from "../../images/rockPaperScissor/scissors.svg";
import {isPlayerA} from "../playGame";

export class RockPaperScissor extends Game {

    private rockButton: HTMLButtonElement | undefined;
    private paperButton: HTMLButtonElement | undefined;
    private scissorButton: HTMLButtonElement | undefined;

    private ownScore: HTMLElement | undefined;
    private opponentScore: HTMLElement | undefined;

    private buttonsDiv: HTMLElement | undefined;
    private opponentDiv: HTMLElement | undefined;


    setUpHTML(element: HTMLElement): void {

        element.innerHTML = "<div class='rpsSpace'><div class='rpsScore'>0</div><div id='rpsButtons'></div></div><div id='rpsVS'><span>VS</span></div><div class='rpsSpace'><div class='rpsScore'>0</div><div id='rpsOpponent'></div></div>"

        this.buttonsDiv = document.getElementById("rpsButtons")!;
        this.opponentDiv = document.getElementById("rpsOpponent")!;

        this.ownScore = element.getElementsByClassName("rpsScore")[0] as HTMLElement;
        this.opponentScore = element.getElementsByClassName("rpsScore")[1] as HTMLElement;

        //player Buttons
        let buttonDiv = document.getElementById("rpsButtons") as HTMLElement;
        buttonDiv.classList.add("buttons")

        this.rockButton = this.createButton(Options.ROCK, rockSvg)
        buttonDiv.appendChild(this.rockButton);

        this.paperButton = this.createButton(Options.PAPER, paperSvg)
        buttonDiv.appendChild(this.paperButton)

        this.scissorButton = this.createButton(Options.SCISSOR, scissorSvg)
        buttonDiv.appendChild(this.scissorButton);

        //opponent Img
        let opponentDiv = document.getElementById("rpsOpponent") as HTMLElement;
        opponentDiv.appendChild(this.createImg(rockSvg))
        opponentDiv.appendChild(this.createImg(paperSvg))
        opponentDiv.appendChild(this.createImg(scissorSvg))
    }

    setUpSocket(): void {
        socket.on("rpsStartRound", () => {
            this.setButtonState(false)
            this.clearOptions()
        })
        socket.on("rpsPlayerWon", (winner: Player) => {
            alert("Player " + winner + " won")

            this.setButtonState(true)
        })
        socket.on("rpsRoundInfo", (info: { playerAOption: Options, playerBOption: Options, playerAScore: number, playerBScore: number }) => {
            let opponentOption = isPlayerA() ? info.playerBOption : info.playerAOption;
            
            switch (opponentOption) {
                case Options.ROCK:
                    this.opponentDiv?.children.item(0)!.classList.add("chosen")
                    break;
                case Options.PAPER:
                    this.opponentDiv?.children.item(1)!.classList.add("chosen")
                    break;
                case Options.SCISSOR:
                    this.opponentDiv?.children.item(2)!.classList.add("chosen")
                    break;
            }

            this.opponentDiv?.classList.add("chosen")

            this.ownScore!.innerText = String(isPlayerA() ? info.playerAScore : info.playerBScore);
            this.opponentScore!.innerText = String(isPlayerA() ? info.playerBScore : info.playerAScore);
        })
    }

    tearDownSocket(): void {
        socket.removeAllListeners("rpsStartRound")
        socket.removeAllListeners("rpsPlayerWon")
        socket.removeAllListeners("rpsRoundInfo")
    }

    createButton(option: Options, url: string): HTMLButtonElement {
        let button = document.createElement("button")
        button.appendChild(this.createImg(url))

        button.addEventListener("click", () => {
            this.chooseOption(option)
        })

        return button;
    }

    createImg(url: string): HTMLImageElement {
        let svg = document.createElement("img");
        svg.src = url;

        return svg
    }

    chooseOption(option: Options): void {
        this.setButtonState(true)

        if (option == Options.ROCK) {
            this.rockButton?.classList.add("chosen")
        } else if (option == Options.PAPER) {
            this.paperButton?.classList.add("chosen")
        } else {
            this.scissorButton?.classList.add("chosen")
        }

        socket.emit("rpsChooseOption", option);
    }

    setButtonState(state: boolean) {
        this.rockButton!.disabled = state
        this.paperButton!.disabled = state
        this.scissorButton!.disabled = state
    }

    clearOptions() {
        for (let i = 0; i < this.buttonsDiv!.children.length; i++) {
            this.buttonsDiv!.children.item(i)!.classList.remove("chosen")
        }

        this.opponentDiv?.classList.remove("chosen")
        for (let i = 0; i < this.opponentDiv!.children.length; i++) {
            this.opponentDiv!.children.item(i)!.classList.remove("chosen")
        }
    }
}

enum Options {
    PAPER, ROCK, SCISSOR
}