import {Game} from "../../Game";
import {Room} from "../../Room";
import {Player} from "../../../../types/Types";

export abstract class RoundBasedGame extends Game {

    protected playerAScore: number = 0;
    protected playerBScore: number = 0;

    private readonly roundCount: number;

    constructor(room: Room, roundCount: number) {
        super(room);

        this.roundCount = roundCount;
    }

    protected nextRound() {
        let winner = this.computeRoundWinner();

        if (winner == Player.PLAYER_A) this.playerAScore++;
        if (winner == Player.PLAYER_B) this.playerBScore++;

        this.room.brodCast("roundBasedScore", [this.playerAScore, this.playerBScore])

        if (this.endRound()) {
            this.startRound();
        }

    }

    private endRound(): boolean {
        if (this.playerAScore >= this.roundCount) {
            this.room.brodCast("roundBasedPlayerWon", Player.PLAYER_A)
            this.room.endGame(Player.PLAYER_A)

            return false;

        } else if (this.playerBScore >= this.roundCount) {
            this.room.brodCast("roundBasedPlayerWon", Player.PLAYER_B)

            this.room.endGame(Player.PLAYER_B)
            return false;
        }

        return true;
    }

    protected abstract startRound();

    protected abstract computeRoundWinner(): Player;
}