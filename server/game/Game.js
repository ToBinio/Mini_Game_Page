"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Types_1 = require("../../types/Types");
var Game = /** @class */ (function () {
    function Game(room) {
        this.room = room;
        this.setUpSocket(room.CLIENTS[0], Types_1.Player.PLAYER_A);
        this.setUpSocket(room.CLIENTS[1], Types_1.Player.PLAYER_B);
        //todo only start when both player gave ready
        this.start();
    }
    return Game;
}());
exports.Game = Game;
