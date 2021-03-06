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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickTackToe = void 0;
var Types_1 = require("../../../types/Types");
var RoundBasedGame_1 = require("./prefabs/RoundBasedGame");
var app_1 = require("../../app");
var TickTackToe = /** @class */ (function (_super) {
    __extends(TickTackToe, _super);
    function TickTackToe(room, roundCount) {
        return _super.call(this, room, roundCount) || this;
    }
    TickTackToe.prototype.setUpSocket = function (client, player) {
        var _this = this;
        client.SOCKET.on("tttChooseField", function (field) {
            if (_this.currentActivePlayer == player) {
                if (_this.map[field[0]][field[1]] == FieldState.EMPTY) {
                    _this.map[field[0]][field[1]] = player == Types_1.Player.PLAYER_A ? FieldState.PLAYER_A : FieldState.PLAYER_B;
                    _this.currentActivePlayer = _this.currentActivePlayer == Types_1.Player.PLAYER_A ? Types_1.Player.PLAYER_B : Types_1.Player.PLAYER_A;
                    _this.nextTurn();
                }
            }
        });
    };
    TickTackToe.prototype.tearDownSocket = function (client, player) {
        client.SOCKET.removeAllListeners("tttChooseField");
    };
    TickTackToe.prototype.start = function () {
        this.currentActivePlayer = Math.random() > 0.5 ? Types_1.Player.PLAYER_A : Types_1.Player.PLAYER_B;
        this.map = [[FieldState.EMPTY, FieldState.EMPTY, FieldState.EMPTY], [FieldState.EMPTY, FieldState.EMPTY, FieldState.EMPTY], [FieldState.EMPTY, FieldState.EMPTY, FieldState.EMPTY]];
        this.startRound().then();
    };
    TickTackToe.prototype.nextTurn = function () {
        this.room.brodCast("tttTurnInfo", { activePlayer: this.currentActivePlayer, map: this.map });
        for (var x = 0; x < 3; x++) {
            if (this.map[x][0] == FieldState.EMPTY)
                continue;
            if (this.map[x][0] == this.map[x][1] && this.map[x][1] == this.map[x][2]) {
                this.room.brodCast("tttRoundEnded", [[x, 0], [x, 1], [x, 2]]);
                this.roundWinner = this.map[x][0] == FieldState.PLAYER_A ? Types_1.Player.PLAYER_A : Types_1.Player.PLAYER_B;
                this.nextRound();
                return;
            }
        }
        for (var y = 0; y < 3; y++) {
            if (this.map[0][y] == FieldState.EMPTY)
                continue;
            if (this.map[0][y] == this.map[1][y] && this.map[1][y] == this.map[2][y]) {
                this.room.brodCast("tttRoundEnded", [[0, y], [1, y], [2, y]]);
                this.roundWinner = this.map[y][0] == FieldState.PLAYER_A ? Types_1.Player.PLAYER_A : Types_1.Player.PLAYER_B;
                this.nextRound();
                return;
            }
        }
        if (this.map[1][1] != FieldState.EMPTY && this.map[0][0] == this.map[1][1] && this.map[1][1] == this.map[2][2]) {
            this.room.brodCast("tttRoundEnded", [[0, 0], [1, 1], [2, 2]]);
            this.roundWinner = this.map[1][1] == FieldState.PLAYER_A ? Types_1.Player.PLAYER_A : Types_1.Player.PLAYER_B;
            this.nextRound();
            return;
        }
        if (this.map[1][1] != FieldState.EMPTY && this.map[2][0] == this.map[1][1] && this.map[1][1] == this.map[0][2]) {
            this.room.brodCast("tttRoundEnded", [[2, 0], [1, 1], [0, 2]]);
            this.roundWinner = this.map[1][1] == FieldState.PLAYER_A ? Types_1.Player.PLAYER_A : Types_1.Player.PLAYER_B;
            this.nextRound();
            return;
        }
        var mapHasEmptyTiles = false;
        for (var x = 0; x < this.map.length; x++) {
            for (var y = 0; y < this.map[x].length; y++) {
                if (this.map[x][y] == FieldState.EMPTY)
                    mapHasEmptyTiles = true;
            }
        }
        if (!mapHasEmptyTiles) {
            this.room.brodCast("tttRoundEnded", {});
            this.nextRound();
        }
    };
    TickTackToe.prototype.computeRoundWinner = function () {
        return this.roundWinner;
    };
    TickTackToe.prototype.startRound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var x, y;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, app_1.sleep)(2000)];
                    case 1:
                        _a.sent();
                        this.roundWinner = undefined;
                        for (x = 0; x < 3; x++) {
                            for (y = 0; y < 3; y++) {
                                this.map[x][y] = FieldState.EMPTY;
                            }
                        }
                        this.room.brodCast("tttStartRound");
                        this.nextTurn();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TickTackToe;
}(RoundBasedGame_1.RoundBasedGame));
exports.TickTackToe = TickTackToe;
var FieldState;
(function (FieldState) {
    FieldState[FieldState["EMPTY"] = 0] = "EMPTY";
    FieldState[FieldState["PLAYER_A"] = 1] = "PLAYER_A";
    FieldState[FieldState["PLAYER_B"] = 2] = "PLAYER_B";
})(FieldState || (FieldState = {}));
