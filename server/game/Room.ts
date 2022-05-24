import {Client} from "../client/Client";
import {GameTypes, Player, RoomInfo} from "../../types/Types";

export class Room {
    private readonly CLIENT_A: Client
    private readonly CLIENT_B: Client

    private readonly POSSIBLE_GAMES: boolean[] = []

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

        this.startGame()
    }

    public startGame() {
        //todo choose random Game
        this.brodCast("startGame", GameTypes.ROCK_PAPER_SCISSOR)
    }

    //todo not Public
    public close() {
        this.brodCast("closedGame", {})
    }

    private brodCast(ev: string, data) {
        this.CLIENT_A.sendMessage(ev, data)
        this.CLIENT_B.sendMessage(ev, data)
    }
}