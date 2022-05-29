"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var Types_1 = require("../../types/Types");
var RockPaperScissor_1 = require("./games/RockPaperScissor");
var TickTackToe_1 = require("./games/TickTackToe");
var Room = /** @class */ (function () {
    function Room(clientA, clientB, possibleGames) {
        this.clientsScores = [0, 0];
        this.POSSIBLE_GAMES = [];
        this.nextGameOpinion = [false, false];
        this.CLIENTS = [clientA, clientB];
        this.POSSIBLE_GAMES = possibleGames;
        var roomInfo = {
            names: { playerA: clientA.getName(), playerB: clientB.getName() },
            possibleGames: this.POSSIBLE_GAMES,
            whichPLayer: Types_1.Player.PLAYER_A
        };
        this.CLIENTS[0].joinRoom(this, roomInfo);
        roomInfo.whichPLayer = Types_1.Player.PLAYER_B;
        this.CLIENTS[1].joinRoom(this, roomInfo);
        this.startRandomGame();
    }
    Room.prototype.startRandomGame = function () {
        var chosenGameIndex = this.lastIndexGame;
        //try to not take the same game as before
        if (this.POSSIBLE_GAMES.length != 1 || !this.lastIndexGame) {
            chosenGameIndex = Math.floor(Math.random() * (this.POSSIBLE_GAMES.length - 1));
            if (chosenGameIndex >= this.lastIndexGame) {
                chosenGameIndex = (chosenGameIndex + 1) % this.POSSIBLE_GAMES.length;
            }
        }
        this.lastIndexGame = chosenGameIndex;
        var chosenGame = this.POSSIBLE_GAMES[chosenGameIndex];
        this.brodCast("startGame", chosenGame);
        if (chosenGame == Types_1.GameTypes.ROCK_PAPER_SCISSOR) {
            this.game = new RockPaperScissor_1.RockPaperScissor(this, 5);
        }
        else if (chosenGame == Types_1.GameTypes.TICK_TACK_TOE) {
            this.game = new TickTackToe_1.TickTackToe(this, 3);
        }
    };
    Room.prototype.endGame = function (winner) {
        if (winner == Types_1.Player.PLAYER_A)
            this.clientsScores[0]++;
        else
            this.clientsScores[1]++;
        this.brodCast("gameEnd", this.clientsScores);
        this.game.tearDownSocket(this.CLIENTS[0], Types_1.Player.PLAYER_A);
        this.game.tearDownSocket(this.CLIENTS[1], Types_1.Player.PLAYER_B);
        this.game = null;
    };
    Room.prototype.setNextGameOpinion = function (client) {
        if (this.game != null)
            return;
        if (client == this.CLIENTS[0]) {
            this.nextGameOpinion[0] = !this.nextGameOpinion[0];
            this.brodCast("nextGameOpinion", this.nextGameOpinion[0]);
        }
        else {
            this.nextGameOpinion[1] = !this.nextGameOpinion[1];
            this.brodCast("nextGameOpinion", this.nextGameOpinion[1]);
        }
        if (this.nextGameOpinion[0] && this.nextGameOpinion[1]) {
            this.nextGameOpinion[0] = false;
            this.nextGameOpinion[1] = false;
            this.startRandomGame();
        }
    };
    //todo not Public
    Room.prototype.close = function () {
        if (this.game)
            this.endGame(Types_1.Player.PLAYER_A);
        this.CLIENTS[0].closedRoom();
        this.CLIENTS[1].closedRoom();
    };
    Room.prototype.brodCast = function (ev, data) {
        if (data === void 0) { data = {}; }
        this.CLIENTS[0].sendMessage(ev, data);
        this.CLIENTS[1].sendMessage(ev, data);
    };
    return Room;
}());
exports.Room = Room;
