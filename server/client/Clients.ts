import {Client} from "./Client";
import {Room} from "../game/Room";

let clients: Client[] = [];

export function addClientToQue(client: Client) {

    for (let i = 0; i < clients.length; i++) {
        let gamePairs = client.getGamePairs(clients[i]);

        if (gamePairs.indexOf(true) != -1) {
            new Room(client, clients[i], gamePairs)

            clients.splice(i, 1);
            return
        }
    }

    clients.push(client)
}

export function removeClientFromQue(client: Client) {
    clients.splice(clients.indexOf(client), 1)
}