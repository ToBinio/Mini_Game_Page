"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var GameTypes_1 = require("./GameTypes");
var Room = /** @class */ (function () {
    function Room(clientA, clientB) {
        this.CLIENT_A = clientA;
        this.CLIENT_B = clientB;
        //todo choose random Game
        this.brodCast("joinedGame", GameTypes_1.GameTypes.CONNECT_FOUR);
    }
    Room.prototype.brodCast = function (ev, data) {
        this.CLIENT_A.sendMessage(ev, data);
        this.CLIENT_B.sendMessage(ev, data);
    };
    return Room;
}());
exports.Room = Room;
