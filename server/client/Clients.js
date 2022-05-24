"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeClientFromQue = exports.addClientToQue = void 0;
var Room_1 = require("../game/Room");
var clients = [];
function addClientToQue(client) {
    for (var i = 0; i < clients.length; i++) {
        var gamePairs = client.getGamePairs(clients[i]);
        if (gamePairs.indexOf(true) != -1) {
            new Room_1.Room(client, clients[i], gamePairs);
            clients.splice(i, 1);
            return;
        }
    }
    clients.push(client);
}
exports.addClientToQue = addClientToQue;
function removeClientFromQue(client) {
    clients.splice(clients.indexOf(client), 1);
}
exports.removeClientFromQue = removeClientFromQue;
