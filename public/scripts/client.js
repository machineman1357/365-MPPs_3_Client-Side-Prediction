import { Cursor, OtherPlayerCursor } from "./cursor.js";
import { setBodyColor } from "./main.js";
import { localPlayerCursor } from "./playerCursor.js";
import { addPlayer, players, removePlayer } from "./playersManager.js";

export const socket = io();

socket.on("connect", () => {
    console.log("You connected.");
    addPlayer(socket.id, localPlayerCursor);
});
socket.on("disconnect", (reason) => {
    console.log("You disconnected.");
    if (players[socket.id]) {
        playerCursor.resetColor();
        setBodyColor("hex", ["ffffff"]);
    }
});
socket.on("randomColorDegree", (colorDegree) => {
    if (players[socket.id]) {
        players[socket.id].cursor.setCursorColor(colorDegree);
        setBodyColor("colorDegree", [players[socket.id].cursor.colorDegree]);
    }
});
socket.on("playerConnected", (colorDegree, socketID) => {
    const playerCursor = new OtherPlayerCursor({
        colorDegree: colorDegree
    });
    playerCursor.setCursorColor(playerCursor.colorDegree);
    addPlayer(socketID, playerCursor);
});
socket.on("playerDisconnected", (socketID) => {
    removePlayer(socketID);
});
socket.on("otherPlayers", (otherPlayers) => {
    // console.log("otherPlayers", otherPlayers);
    otherPlayers.forEach(player => {
        const playerID = player[0];
        const playerColorDegree = player[1];
        const playerCursor = new OtherPlayerCursor({
            colorDegree: playerColorDegree
        });
        playerCursor.setCursorColor(playerCursor.colorDegree);
        addPlayer(playerID, playerCursor);
    });
});
socket.on("setPlayerPosition", (socketID, x, y) => {
    players[socketID].cursor.setLastReceivedPosition(x, y);
});
socket.on("sendRTT", (timeSent, serverReceivedTime, clientToServerTime) => {
    console.log("C => S: " + clientToServerTime, "S => C: " + (Date.now() - serverReceivedTime), "RTT: " + (serverReceivedTime - timeSent));
});