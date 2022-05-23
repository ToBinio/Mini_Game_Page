import {Client} from "./Client";
import {Room} from "../game/Room";

let clients: Client[] = [];

export function addClientToQue(client: Client) {
    for (let i = 0; i < clients.length; i++) {
        if (client.hasGamePair(clients[i])) {
            new Room(client, clients[i])

            clients.splice(i, 1);
            return
        }
    }

    clients.push(client)
}

export function removeClientFromQue(client: Client) {
    clients.splice(clients.indexOf(client), 1)
}

//todo remove from que when closing browser