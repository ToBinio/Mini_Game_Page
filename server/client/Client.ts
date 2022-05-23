import {Socket} from "socket.io";
import {GameTypes} from "../game/GameTypes";
import {addClientToQue, removeClientFromQue} from "./Clients";
import {Room} from "../game/Room";

export class Client {
    private readonly SOCKET: Socket;
    private readonly GAMES_TO_PLAY: Boolean[];

    private clientState: ClientState
    private room: Room;

    constructor(socket: Socket) {
        this.SOCKET = socket;
        this.GAMES_TO_PLAY = []

        this.clientState = ClientState.SLEEPING;

        this.initSocket()
    }

    private initSocket() {
        this.SOCKET.on("addGameToPlay", (game: GameTypes) => {
            if (this.clientState != ClientState.SLEEPING) return
            
            this.GAMES_TO_PLAY[game] = true;
        })

        this.SOCKET.on("removeGameToPlay", (game: GameTypes) => {
            if (this.clientState != ClientState.SLEEPING) return

            this.GAMES_TO_PLAY[game] = false;
        })

        this.SOCKET.on("joinGameQue", () => {
            if (this.clientState != ClientState.SLEEPING) return

            this.clientState = ClientState.SEARCHING_GAME
            addClientToQue(this)
        })

        this.SOCKET.on("disconnect", () => {
            if (this.clientState == ClientState.SEARCHING_GAME) {
                removeClientFromQue(this)
            } else if (this.clientState == ClientState.PLAYING_GAME) {
                this.room.close()
            }
        })
    }

    public sendMessage(ev: string, data) {
        this.SOCKET.emit(ev, data);
    }

    public hasGamePair(otherClient: Client): boolean {
        for (let i = 0; i < this.GAMES_TO_PLAY.length; i++) {
            if (otherClient.GAMES_TO_PLAY[i] && this.GAMES_TO_PLAY[i]) return true;
        }
    }

    public joinRoom(room: Room) {
        this.room = room;
        this.clientState = ClientState.PLAYING_GAME;
    }
}

enum ClientState {
    SLEEPING, SEARCHING_GAME, PLAYING_GAME
}