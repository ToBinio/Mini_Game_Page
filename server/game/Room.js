"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var Types_1 = require("../../types/Types");
var Room = /** @class */ (function () {
    function Room(clientA, clientB, possibleGames) {
        this.POSSIBLE_GAMES = [];
        this.CLIENT_A = clientA;
        this.CLIENT_B = clientB;
        this.POSSIBLE_GAMES = possibleGames;
        var roomInfo = {
            names: { playerA: clientA.getName(), playerB: clientB.getName() },
            possibleGames: this.POSSIBLE_GAMES,
            whichPLayer: Types_1.Player.PLAYER_A
        };
        this.CLIENT_A.joinRoom(this, roomInfo);
        roomInfo.whichPLayer = Types_1.Player.PLAYER_B;
        this.CLIENT_B.joinRoom(this, roomInfo);
        this.startGame();
    }
    Room.prototype.startGame = function () {
        //todo choose random Game
        this.brodCast("startGame", Types_1.GameTypes.ROCK_PAPER_SCISSOR);
    };
    //todo not Public
    Room.prototype.close = function () {
        this.brodCast("closedGame", {});
    };
    Room.prototype.brodCast = function (ev, data) {
        this.CLIENT_A.sendMessage(ev, data);
        this.CLIENT_B.sendMessage(ev, data);
    };
    return Room;
}());
exports.Room = Room;
