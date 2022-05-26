import {Game} from "../Game";
import {Client} from "../../client/Client";
import {Player} from "../../../types/Types";
import {sleep} from "../../app";

export class RockPaperScissor extends Game {

    private playerAOption: Options;
    private playerBOption: Options;

    private playerAScore: number = 0;
    private playerBScore: number = 0;

    constructor(room) {
        super(room);
    }

    start(): void {
        this.room.brodCast("rpsStartRound");
    }

    async round() {
        if (this.playerAOption != this.playerBOption) {
            if ((this.playerAOption + 1) % 3 == this.playerBOption) {
                this.playerAScore++;
            } else {
                this.playerBScore++;
            }
        }

        this.room.brodCast("rpsRoundInfo", {
            playerAOption: this.playerAOption,
            playerBOption: this.playerBOption,
            playerAScore: this.playerAScore,
            playerBScore: this.playerBScore
        })

        await sleep(2000)

        if (this.playerAScore >= 3) {
            this.room.brodCast("rpsPlayerWon", Player.PLAYER_A)
            this.room.endGame(Player.PLAYER_A)

        } else if (this.playerBScore >= 3) {
            this.room.brodCast("rpsPlayerWon", Player.PLAYER_B)
            this.room.endGame(Player.PLAYER_B)
        } else {
            this.room.brodCast("rpsStartRound");
        }

        this.playerAOption = undefined;
        this.playerBOption = undefined;
    }

    setUpSocket(client: Client, player: Player): void {
        client.SOCKET.on("rpsChooseOption", (option: Options) => {
            if (player == Player.PLAYER_A) {
                this.playerAOption = option;

                if (this.playerBOption != undefined) this.round().then()

            } else {
                this.playerBOption = option;

                if (this.playerAOption != undefined) this.round().then();
            }
        })
    }

    tearDownSocket(client: Client, player: Player): void {
        client.SOCKET.removeAllListeners("rpsChooseOption")
    }
}

enum Options {
    PAPER, ROCK, SCISSOR
}