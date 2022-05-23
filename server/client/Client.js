"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var Clients_1 = require("./Clients");
var Client = /** @class */ (function () {
    function Client(socket) {
        this.SOCKET = socket;
        this.GAMES_TO_PLAY = [];
        this.clientState = ClientState.SLEEPING;
        this.initSocket();
    }
    Client.prototype.initSocket = function () {
        var _this = this;
        this.SOCKET.on("addGameToPlay", function (game) {
            if (_this.clientState != ClientState.SLEEPING)
                return;
            _this.GAMES_TO_PLAY[game] = true;
        });
        this.SOCKET.on("removeGameToPlay", function (game) {
            if (_this.clientState != ClientState.SLEEPING)
                return;
            _this.GAMES_TO_PLAY[game] = false;
        });
        this.SOCKET.on("joinGameQue", function () {
            if (_this.clientState != ClientState.SLEEPING)
                return;
            _this.clientState = ClientState.SEARCHING_GAME;
            (0, Clients_1.addClientToQue)(_this);
        });
        this.SOCKET.on("disconnect", function () {
            if (_this.clientState == ClientState.SEARCHING_GAME) {
                (0, Clients_1.removeClientFromQue)(_this);
            }
            else if (_this.clientState == ClientState.PLAYING_GAME) {
                _this.room.close();
            }
        });
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
    Client.prototype.joinRoom = function (room) {
        this.room = room;
        this.clientState = ClientState.PLAYING_GAME;
    };
    return Client;
}());
exports.Client = Client;
var ClientState;
(function (ClientState) {
    ClientState[ClientState["SLEEPING"] = 0] = "SLEEPING";
    ClientState[ClientState["SEARCHING_GAME"] = 1] = "SEARCHING_GAME";
    ClientState[ClientState["PLAYING_GAME"] = 2] = "PLAYING_GAME";
})(ClientState || (ClientState = {}));
