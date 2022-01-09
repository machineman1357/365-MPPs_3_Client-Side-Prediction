import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { addPlayer, players, removePlayer } from "./playersManager.js";

const app = express();
const server = createServer(app);
export const io = new Server(server);
const __dirname = path.resolve();
const updateIntervalRate_ms = 1000 / 30;

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

    pendingChanges.players[socket.id] = {
        moves: [],
    };

    socket.on("receivePlayerPosition", (x, y) => {
        socket.broadcast.emit("setPlayerPosition", socket.id, x, y);
    });
    socket.on("requestRTT", (timeSent) => {
        socket.emit("sendRTT", timeSent, Date.now(), Date.now() - timeSent);
    });
    socket.on("clientMove", function (message) {
        pendingChanges.players[socket.id].moves.push({
            dir: message.dir,
            ts: message.ts,
        });
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
    const otherPlayers = otherPlayerKeys
        .map((playerKey) => {
            const player = players[playerKey];
            if (player.socketID !== socket.id) {
                return [player.socketID, player.colorDegree];
            }
        })
        .filter((player) => (player ? true : false));
    return otherPlayers;
}

setInterval(update, updateIntervalRate_ms);

// Incoming changes are batched up and aplied to the worldState at the beginning of each tick.
// These changes include player moves, connections and disconnections.
var pendingChanges = {
    players: {},
};

let prevTS = 0;
function update() {
    for (
        let playerIds = Object.keys(players), i = 0, len = playerIds.length;
        i < len;
        i++
    ) {
        const playerId = playerIds[i];
        const player = players[playerId];
        // Calculate time elapsed since last tick was processed
        const now = Date.now();
        const delta = Date.now() - prevTS;
        prevTS = now;

        var message = {};
        message.clientAdjust = [];

        // Reference the player and the player's pending moves from the
        // game state
        var pendingMoves = pendingChanges.players[playerId].moves;

        var ack;
        // Process all pending moves, which came from the client before
        // the start of this tick, and update the game state
        while (pendingMoves.length > 0) {
            var move = pendingMoves.shift();
            player.x = player.x + move.dir * 0.6 * delta;
            ack = move.ts;
        }

        // Send a message back to client with the newly calculated position.
        // Attach the timestamp of the most recently processed client move.
        message.clientAdjust.push({
            id: playerId,
            ts: ack,
            x: player.x,
        });

        // Send message back to client
        io.emit("gameState", message);
    }
}
