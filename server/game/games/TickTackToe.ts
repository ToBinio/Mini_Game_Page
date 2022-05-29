import {Player} from "../../../types/Types";
import {Client} from "../../client/Client";
import {RoundBasedGame} from "./prefabs/RoundBasedGame";
import {Room} from "../Room";
import {sleep} from "../../app";

export class TickTackToe extends RoundBasedGame {

    private map: FieldState[][];

    private currentActivePlayer: Player

    private roundWinner: Player;

    constructor(room: Room, roundCount: number) {
        super(room, roundCount);


    }

    setUpSocket(client: Client, player: Player): void {
        client.SOCKET.on("tttChooseField", (field: number[]) => {

            if (this.currentActivePlayer == player) {
                if (this.map[field[0]][field[1]] == FieldState.EMPTY) {

                    this.map[field[0]][field[1]] = player == Player.PLAYER_A ? FieldState.PLAYER_A : FieldState.PLAYER_B;

                    this.currentActivePlayer = this.currentActivePlayer == Player.PLAYER_A ? Player.PLAYER_B : Player.PLAYER_A;
                    this.nextTurn()
                }
            }
        })
    }

    tearDownSocket(client: Client, player: Player): void {
        client.SOCKET.removeAllListeners("tttChooseField")
    }

    start(): void {
        this.currentActivePlayer = Math.random() > 0.5 ? Player.PLAYER_A : Player.PLAYER_B;

        this.map = [[FieldState.EMPTY, FieldState.EMPTY, FieldState.EMPTY], [FieldState.EMPTY, FieldState.EMPTY, FieldState.EMPTY], [FieldState.EMPTY, FieldState.EMPTY, FieldState.EMPTY]];

        this.startRound().then()
    }

    nextTurn() {
        this.room.brodCast("tttTurnInfo", {activePlayer: this.currentActivePlayer, map: this.map})

        for (let x = 0; x < 3; x++) {
            if (this.map[x][0] == FieldState.EMPTY) continue;

            if (this.map[x][0] == this.map[x][1] && this.map[x][1] == this.map[x][2]) {

                this.room.brodCast("tttRoundEnded", [[x, 0], [x, 1], [x, 2]])

                this.roundWinner = this.map[x][0] == FieldState.PLAYER_A ? Player.PLAYER_A : Player.PLAYER_B;

                this.nextRound()
                return
            }
        }

        for (let y = 0; y < 3; y++) {
            if (this.map[0][y] == FieldState.EMPTY) continue;

            if (this.map[0][y] == this.map[1][y] && this.map[1][y] == this.map[2][y]) {

                this.room.brodCast("tttRoundEnded", [[0, y], [1, y], [2, y]])

                this.roundWinner = this.map[y][0] == FieldState.PLAYER_A ? Player.PLAYER_A : Player.PLAYER_B;

                this.nextRound()
                return
            }
        }

        if (this.map[1][1] != FieldState.EMPTY && this.map[0][0] == this.map[1][1] && this.map[1][1] == this.map[2][2]) {
            this.room.brodCast("tttRoundEnded", [[0, 0], [1, 1], [2, 2]])

            this.roundWinner = this.map[1][1] == FieldState.PLAYER_A ? Player.PLAYER_A : Player.PLAYER_B;

            this.nextRound()
            return
        }

        if (this.map[1][1] != FieldState.EMPTY && this.map[2][0] == this.map[1][1] && this.map[1][1] == this.map[0][2]) {
            this.room.brodCast("tttRoundEnded", [[2, 0], [1, 1], [0, 2]])

            this.roundWinner = this.map[1][1] == FieldState.PLAYER_A ? Player.PLAYER_A : Player.PLAYER_B;

            this.nextRound()
            return
        }

        let mapHasEmptyTiles = false;

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map[x].length; y++) {
                if (this.map[x][y] == FieldState.EMPTY) mapHasEmptyTiles = true;
            }
        }

        if (!mapHasEmptyTiles) {
            this.room.brodCast("tttRoundEnded", {})
            this.nextRound()
        }
    }

    protected computeRoundWinner(): Player {
        return this.roundWinner;
    }

    protected async startRound() {
        await sleep(2000)

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                this.map[x][y] = FieldState.EMPTY
            }
        }

        this.room.brodCast("tttStartRound")
        this.nextTurn()
    }
}

enum FieldState {
    EMPTY, PLAYER_A, PLAYER_B
}