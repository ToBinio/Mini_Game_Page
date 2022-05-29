"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundBasedGame = void 0;
var Game_1 = require("../../Game");
var Types_1 = require("../../../../types/Types");
var RoundBasedGame = /** @class */ (function (_super) {
    __extends(RoundBasedGame, _super);
    function RoundBasedGame(room, roundCount) {
        var _this = _super.call(this, room) || this;
        _this.playerAScore = 0;
        _this.playerBScore = 0;
        _this.roundCount = roundCount;
        return _this;
    }
    RoundBasedGame.prototype.nextRound = function () {
        var winner = this.computeRoundWinner();
        if (winner == Types_1.Player.PLAYER_A)
            this.playerAScore++;
        if (winner == Types_1.Player.PLAYER_B)
            this.playerBScore++;
        this.room.brodCast("roundBasedScore", [this.playerAScore, this.playerBScore]);
        if (this.endRound()) {
            this.startRound();
        }
    };
    RoundBasedGame.prototype.endRound = function () {
        if (this.playerAScore >= this.roundCount) {
            this.room.brodCast("roundBasedPlayerWon", Types_1.Player.PLAYER_A);
            this.room.endGame(Types_1.Player.PLAYER_A);
            return false;
        }
        else if (this.playerBScore >= this.roundCount) {
            this.room.brodCast("roundBasedPlayerWon", Types_1.Player.PLAYER_B);
            this.room.endGame(Types_1.Player.PLAYER_B);
            return false;
        }
        return true;
    };
    return RoundBasedGame;
}(Game_1.Game));
exports.RoundBasedGame = RoundBasedGame;
