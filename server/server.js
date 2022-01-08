import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { addPlayer, players, removePlayer } from "./playersManager.js";

const app = express();
const server = createServer(app);
export const io = new Server(server);
const __dirname = path.resolve();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.use(express.static("public"));

io.on("connection", (socket) => {
    onPlayerConnected(socket);
    socket.on("disconnect", () => {
        removePlayer(socket);
        socket.broadcast.emit("playerDisconnected", socket.id);
    });
    socket.on("receivePlayerPosition", (x, y) => {
        socket.broadcast.emit("setPlayerPosition", socket.id, x, y);
    });
    socket.on("requestRTT", (timeSent) => {
        socket.emit("sendRTT", timeSent, Date.now(), Date.now() - timeSent);
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});

function onPlayerConnected(socket) {
    const player = addPlayer(socket);
    // tell all clients except sender of their joining
    socket.broadcast.emit("playerConnected", player.colorDegree, socket.id);
    // tell sender of other players
    socket.emit("otherPlayers", getOtherPlayers(socket));
}

function getOtherPlayers(socket) {
    const otherPlayerKeys = Object.keys(players);
    const otherPlayers = otherPlayerKeys.map((playerKey) => {
        const player = players[playerKey];
        if(player.socketID !== socket.id) {
            return [player.socketID, player.colorDegree];
        }; 
    }).filter(player => player ? true : false);
    return otherPlayers;
}