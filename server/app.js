"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
var path = require("path");
var socketIo = require("socket.io");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
exports.io = new socketIo.Server(server, {
    cors: {
        origin: "*"
    }
});
app.use(express.static(path.join(__dirname, "../client/build/")));
app.get("", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/public/index.html"));
});
server.listen(8080, function () {
    console.log("Server started on Port: 8080");
});
exports.io.on("connect", function (socket) {
    console.log("socket : " + socket.id + " has connected");
});
