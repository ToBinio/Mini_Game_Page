import {Socket} from "socket.io";
import {GameTypes} from "../game/GameTypes";
import {addClientToQue} from "./Clients";

export class Client {
    private readonly SOCKET: Socket;
    private readonly GAMES_TO_PLAY: Boolean[];

    constructor(socket: Socket) {
        this.SOCKET = socket;
        this.GAMES_TO_PLAY = []

        this.initSocket()
    }

    private initSocket() {
        this.SOCKET.on("addGameToPlay", (game: GameTypes) => {
            this.GAMES_TO_PLAY[game] = true;
        })

        this.SOCKET.on("removeGameToPlay", (game: GameTypes) => {
            this.GAMES_TO_PLAY[game] = false;
        })

        this.SOCKET.on("joinGameQue", () => addClientToQue(this))
    }

    public sendMessage(ev: string, data) {
        this.SOCKET.emit(ev, data);
    }

    public hasGamePair(otherClient: Client): boolean {
        for (let i = 0; i < this.GAMES_TO_PLAY.length; i++) {
            if (otherClient.GAMES_TO_PLAY[i] && this.GAMES_TO_PLAY[i]) return true;
        }
    }
}