"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var Types_1 = require("../../types/Types");
var RockPaperScissor_1 = require("./games/RockPaperScissor");
var Room = /** @class */ (function () {
    function Room(clientA, clientB, possibleGames) {
        this.clientAScore = 0;
        this.clientBScore = 0;
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
        this.startRandomGame();
    }
    Room.prototype.startRandomGame = function () {
        //todo choose random Game
        this.brodCast("startGame", Types_1.GameTypes.ROCK_PAPER_SCISSOR);
        this.game = new RockPaperScissor_1.RockPaperScissor(this);
    };
    Room.prototype.endGame = function (winner) {
        if (winner == Types_1.Player.PLAYER_A)
            this.clientAScore++;
        else
            this.clientBScore++;
        this.game.tearDownSocket(this.CLIENT_A, Types_1.Player.PLAYER_A);
        this.game.tearDownSocket(this.CLIENT_B, Types_1.Player.PLAYER_B);
        this.game = undefined;
        //todo
        this.close();
    };
    //todo not Public
    Room.prototype.close = function () {
        if (this.game)
            this.endGame(Types_1.Player.PLAYER_A);
        this.CLIENT_A.closedRoom();
        this.CLIENT_B.closedRoom();
    };
    Room.prototype.brodCast = function (ev, data) {
        if (data === void 0) { data = {}; }
        this.CLIENT_A.sendMessage(ev, data);
        this.CLIENT_B.sendMessage(ev, data);
    };
    return Room;
}());
exports.Room = Room;
