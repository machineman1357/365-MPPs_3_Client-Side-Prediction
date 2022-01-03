import { socket } from "./client.js";

export const players = {};

export function addPlayer(socketID, cursor) {
    // console.log("addPlayer", socketID);
    players[socketID] = new Player(socketID, cursor);
}

export function removePlayer(socketID) {
    // console.log("removePlayer", socketID, players, players[socketID]);
    players[socketID].cursor.destroy();
    delete players[socketID];
}

export function update_playerCursors() {
    const otherPlayerKeys = Object.keys(players);
    otherPlayerKeys.forEach(playerKey => {
        const player = players[playerKey];
        player.cursor.update();
    });
}

class Player {
    constructor(socketID, cursor) {
        this.socketID = socketID;
        this.cursor = cursor;
    }
}