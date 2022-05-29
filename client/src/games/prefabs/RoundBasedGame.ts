import {Game} from "../Game";
import {popAnimation, socket} from "../../index";
import {Player} from "../../../../types/Types";
import {currentPlayer, isPlayerA, opponentName} from "../../playGame";
import {setStateInfo} from "../../stateManger";

export abstract class RoundBasedGame extends Game {

    protected userScore: HTMLElement | undefined;
    protected opponentScore: HTMLElement | undefined;

    setUpSocket(): void {
        socket.on("roundBasedPlayerWon", (winner: Player) => {
            if (winner == currentPlayer) {
                setStateInfo("you have Won! :)")
            } else {
                setStateInfo(opponentName + " has Won! :(")
            }

            this.resetAfterGame()
        })

        socket.on("roundBasedScore", (scores: number[]) => {
            let newUserScore = String(isPlayerA() ? scores[0] : scores[1]);
            let newOpponentScore = String(isPlayerA() ? scores[1] : scores[0]);

            if (newUserScore != this.userScore?.innerText) {
                this.userScore!.innerText = newUserScore;

                popAnimation(this.userScore!)
            }

            if (newOpponentScore != this.opponentScore?.innerText) {
                this.opponentScore!.innerText = newOpponentScore;

                popAnimation(this.opponentScore!)
            }
        })
    }

    tearDownSocket(): void {
        socket.removeAllListeners("roundBasedPlayerWon")
        socket.removeAllListeners("roundBasedScore")
    }

    abstract resetAfterGame(): void;

}