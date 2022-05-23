import {Client} from "../client/Client";
import {GameTypes} from "./GameTypes";

export class Room {
    private readonly CLIENT_A: Client
    private readonly CLIENT_B: Client

    constructor(clientA: Client, clientB: Client) {
        this.CLIENT_A = clientA;
        this.CLIENT_B = clientB;

        this.CLIENT_A.joinRoom(this)
        this.CLIENT_B.joinRoom(this)

        //todo choose random Game
        this.brodCast("joinedGame", GameTypes.CONNECT_FOUR)
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