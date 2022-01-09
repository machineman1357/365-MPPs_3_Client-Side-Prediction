const savedMoves = [];

export function addMoveToHistory(move) {
    savedMoves.push(move);
    while (savedMoves.length > 30) {
        savedMoves.shift();
    }
}
