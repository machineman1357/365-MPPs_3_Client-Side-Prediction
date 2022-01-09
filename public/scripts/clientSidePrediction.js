import { players } from "./playersManager.js";

const savedMoves = [];

export function addMoveToHistory(move) {
    savedMoves.push(move);
    while (savedMoves.length > 30) {
        savedMoves.shift();
    }
}

export function handleReceivedGameState(clientsAdjust) {
    for (let i = 0; i < clientsAdjust.length; i++) {
        const clientAdjust = clientsAdjust[i];
        const serverTS = clientAdjust.ts;
        const x = clientAdjust.x;
        const clientId = clientAdjust.id;
        const player = players[clientId];

        // Erase all saved moves timestamped before the received server
        // telemetry
        savedMoves = savedMoves.filter((savedMove) => {
            savedMove.ts > serverTS;
        });

        // Calculate a reconciled position using the data from the
        // server telemetry as a starting point, and then re-applying
        // the filtered saved moves.
        savedMoves.forEach((savedMove) => {
            x = x + savedMove.dir * 10;
        });

        player.cursor.setPosition(x, 0);
    }
}
