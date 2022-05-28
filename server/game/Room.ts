import {Client} from "../client/Client";
import {GameTypes, Player, RoomInfo} from "../../types/Types";
import {Game} from "./Game";
import {RockPaperScissor} from "./games/RockPaperScissor";

export class Room {
    public readonly CLIENTS: Client[]

    private clientsScores: number[] = [0, 0];

    private readonly POSSIBLE_GAMES: boolean[] = []

    private game: Game;
    private nextGameOpinion: boolean[] = [false, false];

    constructor(clientA: Client, clientB: Client, possibleGames: boolean[]) {
        this.CLIENTS = [clientA, clientB];

        this.POSSIBLE_GAMES = possibleGames;

        let roomInfo: RoomInfo = {
            names: {playerA: clientA.getName(), playerB: clientB.getName()},
            possibleGames: this.POSSIBLE_GAMES,
            whichPLayer: Player.PLAYER_A
        }

        this.CLIENTS[0].joinRoom(this, roomInfo)

        roomInfo.whichPLayer = Player.PLAYER_B;
        this.CLIENTS[1].joinRoom(this, roomInfo)

        this.startRandomGame()
    }

    public startRandomGame() {
        //todo choose random Game
        this.brodCast("startGame", GameTypes.ROCK_PAPER_SCISSOR)
        this.game = new RockPaperScissor(this);

    }

    public endGame(winner: Player) {
        if (winner == Player.PLAYER_A) this.clientsScores[0]++;
        else this.clientsScores[1]++;

        this.brodCast("gameEnd", this.clientsScores)

        this.game.tearDownSocket(this.CLIENTS[0], Player.PLAYER_A);
        this.game.tearDownSocket(this.CLIENTS[1], Player.PLAYER_B);

        this.game = null;
    }

    public setNextGameOpinion(client: Client) {
        if (this.game != null) return;

        if (client == this.CLIENTS[0]) {
            this.nextGameOpinion[0] = !this.nextGameOpinion[0];
            this.brodCast("nextGameOpinion", this.nextGameOpinion[0])
        } else {
            this.nextGameOpinion[1] = !this.nextGameOpinion[1];
            this.brodCast("nextGameOpinion", this.nextGameOpinion[1])
        }

        if (this.nextGameOpinion[0] && this.nextGameOpinion[1]) {
            this.nextGameOpinion[0] = false;
            this.nextGameOpinion[1] = false;

            this.startRandomGame()
        }
    }

    //todo not Public
    public close() {

        if (this.game) this.endGame(Player.PLAYER_A);

        this.CLIENTS[0].closedRoom()
        this.CLIENTS[1].closedRoom()
    }

    public brodCast(ev: string, data = {}) {
        this.CLIENTS[0].sendMessage(ev, data)
        this.CLIENTS[1].sendMessage(ev, data)
    }
}