"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.GameTypes = void 0;
var GameTypes;
(function (GameTypes) {
    GameTypes[GameTypes["ROCK_PAPER_SCISSOR"] = 0] = "ROCK_PAPER_SCISSOR";
    GameTypes[GameTypes["TICK_TACK_TOE"] = 1] = "TICK_TACK_TOE";
})(GameTypes = exports.GameTypes || (exports.GameTypes = {}));
var Player;
(function (Player) {
    Player[Player["PLAYER_A"] = 0] = "PLAYER_A";
    Player[Player["PLAYER_B"] = 1] = "PLAYER_B";
})(Player = exports.Player || (exports.Player = {}));
