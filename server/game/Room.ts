import {Client} from "../client/Client";
import {GameTypes} from "./GameTypes";

export class Room {
    private readonly CLIENT_A: Client
    private readonly CLIENT_B: Client

    constructor(clientA: Client, clientB: Client) {
        this.CLIENT_A = clientA;
        this.CLIENT_B = clientB;

        //todo choose random Game
        this.brodCast("joinedGame", GameTypes.CONNECT_FOUR)
    }

    private brodCast(ev: string, data) {
        this.CLIENT_A.sendMessage(ev, data)
        this.CLIENT_B.sendMessage(ev, data)
    }
}