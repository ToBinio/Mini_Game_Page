import {Client} from "../client/Client";
import {GameTypes, Player, RoomInfo} from "../../types/Types";
import {Game} from "./Game";
import {RockPaperScissor} from "./games/RockPaperScissor";
import {TickTackToe} from "./games/TickTackToe";

export class Room {
    public readonly CLIENTS: Client[]

    private clientsScores: number[] = [0, 0];

    private readonly POSSIBLE_GAMES: GameTypes[] = []

    private game: Game;
    private lastIndexGame: number;
    private nextGameOpinion: boolean[] = [false, false];

    constructor(clientA: Client, clientB: Client, possibleGames: GameTypes[]) {
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
        let chosenGameIndex: number = this.lastIndexGame;

        //try to not take the same game as before
        if (this.POSSIBLE_GAMES.length != 1 || !this.lastIndexGame) {
            chosenGameIndex = Math.floor(Math.random() * (this.POSSIBLE_GAMES.length - 1))

            if (chosenGameIndex >= this.lastIndexGame) {
                chosenGameIndex = (chosenGameIndex + 1) % this.POSSIBLE_GAMES.length
            }
        }

        this.lastIndexGame = chosenGameIndex;

        let chosenGame = this.POSSIBLE_GAMES[chosenGameIndex]

        this.brodCast("startGame", chosenGame)

        if (chosenGame == GameTypes.ROCK_PAPER_SCISSOR) {
            this.game = new RockPaperScissor(this, 5);
        } else if (chosenGame == GameTypes.TICK_TACK_TOE) {
            this.game = new TickTackToe(this, 3);
        }
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