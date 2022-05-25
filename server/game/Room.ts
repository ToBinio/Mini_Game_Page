import {Client} from "../client/Client";
import {GameTypes, Player, RoomInfo} from "../../types/Types";
import {Game} from "./Game";
import {RockPaperScissor} from "./games/RockPaperScissor";

export class Room {
    public readonly CLIENT_A: Client
    public readonly CLIENT_B: Client

    private clientAScore: number = 0;
    private clientBScore: number = 0;

    private readonly POSSIBLE_GAMES: boolean[] = []

    private game: Game;

    constructor(clientA: Client, clientB: Client, possibleGames: boolean[]) {
        this.CLIENT_A = clientA;
        this.CLIENT_B = clientB;

        this.POSSIBLE_GAMES = possibleGames;

        let roomInfo: RoomInfo = {
            names: {playerA: clientA.getName(), playerB: clientB.getName()},
            possibleGames: this.POSSIBLE_GAMES,
            whichPLayer: Player.PLAYER_A
        }

        this.CLIENT_A.joinRoom(this, roomInfo)

        roomInfo.whichPLayer = Player.PLAYER_B;
        this.CLIENT_B.joinRoom(this, roomInfo)

        this.startRandomGame()
    }

    public startRandomGame() {
        //todo choose random Game
        this.brodCast("startGame", GameTypes.ROCK_PAPER_SCISSOR)
        this.game = new RockPaperScissor(this);

    }

    public endGame(winner: Player) {
        if (winner == Player.PLAYER_A) this.clientAScore++;
        else this.clientBScore++;

        this.game.tearDownSocket(this.CLIENT_A, Player.PLAYER_A);
        this.game.tearDownSocket(this.CLIENT_B, Player.PLAYER_B);

        this.game = undefined;
        //todo
        this.close()
    }

    //todo not Public
    public close() {

        if (this.game) this.endGame(Player.PLAYER_A);

        this.CLIENT_A.closedRoom()
        this.CLIENT_B.closedRoom()
    }

    public brodCast(ev: string, data = {}) {
        this.CLIENT_A.sendMessage(ev, data)
        this.CLIENT_B.sendMessage(ev, data)
    }
}