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
    Client.prototype.getName = function () {
        return this.name;
    };
    Client.prototype.initSocket = function () {
        var _this = this;
        this.SOCKET.on("joinGameQue", function (data) {
            if (_this.clientState != ClientState.SLEEPING)
                return;
            _this.name = data.name;
            _this.GAMES_TO_PLAY = data.enabledGames;
            //check if at leased on game is True(on)
            var hasGameToPlay = false;
            for (var _i = 0, _a = _this.GAMES_TO_PLAY; _i < _a.length; _i++) {
                var boolean = _a[_i];
                if (boolean) {
                    hasGameToPlay = true;
                    break;
                }
            }
            if (!hasGameToPlay)
                return;
            _this.clientState = ClientState.SEARCHING_GAME;
            _this.SOCKET.emit("startSearchingRoom", _this.GAMES_TO_PLAY);
            (0, Clients_1.addClientToQue)(_this);
        });
        this.SOCKET.on("nextGame", function () {
            if (_this.room)
                _this.room.setNextGameOpinion(_this);
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
    Client.prototype.getGamePairs = function (otherClient) {
        var gamePairs = [];
        for (var i = 0; i < this.GAMES_TO_PLAY.length; i++) {
            if (otherClient.GAMES_TO_PLAY[i] && this.GAMES_TO_PLAY[i])
                gamePairs.push(i);
        }
        return gamePairs;
    };
    Client.prototype.joinRoom = function (room, info) {
        this.room = room;
        this.clientState = ClientState.PLAYING_GAME;
        this.SOCKET.emit("joinedRoom", info);
    };
    Client.prototype.closedRoom = function () {
        this.room = undefined;
        this.clientState = ClientState.SLEEPING;
        this.SOCKET.emit("closedRoom");
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
