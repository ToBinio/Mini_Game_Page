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
exports.RockPaperScissor = void 0;
var Game_1 = require("../Game");
var Types_1 = require("../../../types/Types");
var app_1 = require("../../app");
var RockPaperScissor = /** @class */ (function (_super) {
    __extends(RockPaperScissor, _super);
    function RockPaperScissor(room) {
        var _this = _super.call(this, room) || this;
        _this.playerAScore = 0;
        _this.playerBScore = 0;
        return _this;
    }
    RockPaperScissor.prototype.start = function () {
        this.room.brodCast("rpsStartRound");
    };
    RockPaperScissor.prototype.round = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ((this.playerAOption + 1) % 3 == this.playerBOption) {
                            this.playerAScore++;
                        }
                        else if ((this.playerAOption - 1) % 3 == this.playerBOption) {
                            this.playerBScore++;
                        }
                        this.room.CLIENT_A.SOCKET.emit("rpsRoundInfo", {
                            opponentOption: this.playerBOption,
                            ownScore: this.playerAScore,
                            opponentScore: this.playerBScore
                        });
                        this.room.CLIENT_B.SOCKET.emit("rpsRoundInfo", {
                            opponentOption: this.playerAOption,
                            ownScore: this.playerBScore,
                            opponentScore: this.playerAScore
                        });
                        return [4 /*yield*/, (0, app_1.sleep)(1000)];
                    case 1:
                        _a.sent();
                        if (this.playerAScore >= 3) {
                            this.room.brodCast("rpsPlayerWon", Types_1.Player.PLAYER_A);
                            this.room.endGame(Types_1.Player.PLAYER_A);
                        }
                        else if (this.playerBScore >= 3) {
                            this.room.brodCast("rpsPlayerWon", Types_1.Player.PLAYER_B);
                            this.room.endGame(Types_1.Player.PLAYER_B);
                        }
                        else {
                            this.room.brodCast("rpsStartRound");
                        }
                        this.playerAOption = undefined;
                        this.playerBOption = undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    RockPaperScissor.prototype.setUpSocket = function (client, player) {
        var _this = this;
        client.SOCKET.on("rpsChooseOption", function (option) {
            if (player == Types_1.Player.PLAYER_A) {
                _this.playerAOption = option;
                if (_this.playerBOption != undefined)
                    _this.round().then();
            }
            else {
                _this.playerBOption = option;
                if (_this.playerAOption != undefined)
                    _this.round().then();
            }
        });
    };
    RockPaperScissor.prototype.tearDownSocket = function (client, player) {
        client.SOCKET.removeAllListeners("rpsChooseOption");
    };
    return RockPaperScissor;
}(Game_1.Game));
exports.RockPaperScissor = RockPaperScissor;
var Options;
(function (Options) {
    Options[Options["PAPER"] = 0] = "PAPER";
    Options[Options["ROCK"] = 1] = "ROCK";
    Options[Options["SCISSOR"] = 2] = "SCISSOR";
})(Options || (Options = {}));
