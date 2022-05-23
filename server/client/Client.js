"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var Clients_1 = require("./Clients");
var Client = /** @class */ (function () {
    function Client(socket) {
        this.SOCKET = socket;
        this.GAMES_TO_PLAY = [];
        this.initSocket();
    }
    Client.prototype.initSocket = function () {
        var _this = this;
        this.SOCKET.on("addGameToPlay", function (game) {
            _this.GAMES_TO_PLAY[game] = true;
        });
        this.SOCKET.on("removeGameToPlay", function (game) {
            _this.GAMES_TO_PLAY[game] = false;
        });
        this.SOCKET.on("joinGameQue", function () { return (0, Clients_1.addClientToQue)(_this); });
    };
    Client.prototype.sendMessage = function (ev, data) {
        this.SOCKET.emit(ev, data);
    };
    Client.prototype.hasGamePair = function (otherClient) {
        for (var i = 0; i < this.GAMES_TO_PLAY.length; i++) {
            if (otherClient.GAMES_TO_PLAY[i] && this.GAMES_TO_PLAY[i])
                return true;
        }
    };
    return Client;
}());
exports.Client = Client;
