import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { addPlayer, players, removePlayer } from "./playersManager.js";

const app = express();
const server = createServer(app);
export const io = new Server(server);
const __dirname = path.resolve();

// Use the variables to denote player state
var DISCONNECTED = 0;
var CONNECTED = 1;
var READY = 2;
var LEVEL_LOADED = 3;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.use(express.static("public"));

io.on("connection", (socket) => {
    onPlayerConnected(socket);
    socket.on("disconnect", () => {
        removePlayer(socket);
        socket.broadcast.emit("playerDisconnected", socket.id);
        pendingChanges.players[client.id].state.push(DISCONNECTED);
    });

    pendingChanges.players[client.id] = {
        moves: [],
        state: [CONNECTED],
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

setInterval(update, 1000 / 30);

// Incoming changes are batched up and aplied to the worldState at the beginning of each tick.
// These changes include player moves, connections and disconnections.
var pendingChanges = {
    players: {},
    ball: [],
};

let prevTS = 0;
function update() {
    // de-queue the pending player state changes (disconnections, etc)
    var clientIds = Object.keys(pendingChanges.players);
    clientIds.forEach(function (clientId) {
        var stateChanges = pendingChanges.players[clientId].state;

        while (stateChanges.length > 0) {
            var state = stateChanges.shift();

            // Disconnected
            if (state === DISCONNECTED) {
                // remove disconnected player
                delete pendingChanges.players[clientId];

                return;
            }
        }
    });

    // elapsed time
    var now = Date.now();
    var delta = now - prevTs;
    prevTs = now;

    // paddle moves
    message.players = {};
    _.each(worldState.players, function (playerState, clientId) {
        var entity = playerState.entity;
        var oldx = entity.x;
        var pendingMoves = pendingChanges.players[clientId].moves;

        // de-queue all the accumulated player moves
        var ack;
        while (pendingMoves.length > 0) {
            var move = pendingMoves.shift();
            var ack = move.ts;
            // Speed is 600 pixels / second, or 0.6 pixels / millisecond
            entity.vx = move.dir * 0.6;
            entity.update(delta);

            // Handle left/right wall collisions:
            if (entity.right > GAME_WIDTH) {
                entity.setX(GAME_WIDTH - entity.w / 2);
            }

            if (entity.left < 0) {
                entity.setX(entity.w / 2);
            }
        }

        // Only send an adjustment if the x coordinate has changed.
        // Use the ts of the last processed client message to notify
        // the client that it was the last message processed.
        // if (oldx !== entity.x) {
        message.clientAdjust = message.clientAdjust || [];
        message.clientAdjust.push({
            id: clientId,
            ts: ack,
            x: entity.x,
        });
        //}

        // Add player telemetry to outgoing message
        message.players[clientId] = {
            x: entity.x,
            y: entity.y,
        };
    });
}
