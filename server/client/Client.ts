import {Socket} from "socket.io";
import {addClientToQue, removeClientFromQue} from "./Clients";
import {Room} from "../game/Room";
import {GameTypes, RoomInfo} from "../../types/Types";

export class Client {
    private readonly SOCKET: Socket;
    private readonly GAMES_TO_PLAY: Boolean[];

    private name: string;

    private clientState: ClientState
    private room: Room;

    constructor(socket: Socket) {
        this.SOCKET = socket;
        this.GAMES_TO_PLAY = []

        this.clientState = ClientState.SLEEPING;

        this.initSocket()
    }

    public getName(): string {
        return this.name;
    }

    private initSocket() {
        this.SOCKET.on("addGameToPlay", (game: GameTypes) => {
            if (this.clientState != ClientState.SLEEPING) return

            console.log("log");

            this.GAMES_TO_PLAY[game] = true;
        })

        this.SOCKET.on("removeGameToPlay", (game: GameTypes) => {
            if (this.clientState != ClientState.SLEEPING) return

            this.GAMES_TO_PLAY[game] = false;
        })

        this.SOCKET.on("joinGameQue", (name: string) => {
            if (this.clientState != ClientState.SLEEPING) return

            //todo check at leased one is set

            let hasGameToPlay = false;

            for (let boolean of this.GAMES_TO_PLAY) {
                if(boolean) {
                    hasGameToPlay = true
                    break
                }
            }

            if(!hasGameToPlay) return;

            this.name = name;

            this.clientState = ClientState.SEARCHING_GAME
            this.SOCKET.emit("searchingGame", this.GAMES_TO_PLAY)

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

    public getGamePairs(otherClient: Client): boolean[] {

        let gamePairs: boolean[] = []

        for (let i = 0; i < this.GAMES_TO_PLAY.length; i++) {
            if (otherClient.GAMES_TO_PLAY[i] && this.GAMES_TO_PLAY[i]) gamePairs[i] = true;
        }

        return gamePairs
    }

    public joinRoom(room: Room, info: RoomInfo) {
        this.room = room;
        this.clientState = ClientState.PLAYING_GAME;

        this.SOCKET.emit("joinRoom", info)
    }
}

enum ClientState {
    SLEEPING, SEARCHING_GAME, PLAYING_GAME
}