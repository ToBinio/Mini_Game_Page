import {Client} from "../../client/Client";
import {Player} from "../../../types/Types";
import {sleep} from "../../app";
import {RoundBasedGame} from "./prefabs/RoundBasedGame";

export class RockPaperScissor extends RoundBasedGame {

    private playerAOption: Options;
    private playerBOption: Options;

    start(): void {
        this.room.brodCast("rpsStartRound");
    }

    protected computeRoundWinner() {
        this.room.brodCast("rpsRoundInfo", {
            playerAOption: this.playerAOption,
            playerBOption: this.playerBOption
        })

        if (this.playerAOption != this.playerBOption) {
            if ((this.playerAOption + 1) % 3 == this.playerBOption) {
                return Player.PLAYER_A
            } else {
                return Player.PLAYER_B
            }
        }

        return undefined;
    }

    protected async startRound() {
        await sleep(2000)

        this.room.brodCast("rpsStartRound");

        this.playerAOption = undefined;
        this.playerBOption = undefined;
    }

    setUpSocket(client: Client, player: Player):
        void {
        client.SOCKET.on("rpsChooseOption", (option: Options) => {
            if (player == Player.PLAYER_A) {
                this.playerAOption = option;
            } else {
                this.playerBOption = option;
            }

            if (this.playerAOption != undefined && this.playerBOption != undefined) this.nextRound();
        })
    }

    tearDownSocket(client: Client, player: Player):
        void {
        client.SOCKET.removeAllListeners("rpsChooseOption")
    }
}

enum Options {
    PAPER, ROCK, SCISSOR
}