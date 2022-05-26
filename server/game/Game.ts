import {Client} from "../client/Client";
import {Player} from "../../types/Types";
import {Room} from "./Room";

export abstract class Game {
    protected room: Room;

    protected constructor(room: Room) {
        this.room = room;

        this.setUpSocket(room.CLIENTS[0], Player.PLAYER_A);
        this.setUpSocket(room.CLIENTS[1], Player.PLAYER_B);

        //todo only start when both player gave ready
        this.start();
    }

    abstract start(): void;

    abstract setUpSocket(client: Client, player: Player): void;

    abstract tearDownSocket(client: Client, player: Player): void;
}
