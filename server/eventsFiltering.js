import { addPlayer, players, removePlayer } from "./playersManager.js";

export function onPlayerConnected(socket) {
    const player = addPlayer(socket);
    // tell all clients except sender of their joining
    socket.broadcast.emit("playerConnected", player.colorDegree, socket.id);
    // tell sender of other players
    socket.emit("otherPlayers", getOtherPlayers(socket));
}

export function onPlayerDisconnected(socket) {
    removePlayer(socket);
    socket.broadcast.emit("playerDisconnected", socket.id);
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