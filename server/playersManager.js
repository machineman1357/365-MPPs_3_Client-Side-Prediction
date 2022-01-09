export const players = {};

export function addPlayer(socket) {
    console.log("A user connected", socket.id);

    players[socket.id] = new Player(socket.id);

    const randomColorDegree = Math.random() * 360;
    players[socket.id].colorDegree = randomColorDegree;
    socket.emit("randomColorDegree", randomColorDegree);

    return players[socket.id];
}

export function removePlayer(socket) {
    console.log("A user disconnected", socket.id);

    delete players[socket.id];
}

class Player {
    constructor(socketID) {
        this.socketID = socketID;
        this.moves = [];
    }
}