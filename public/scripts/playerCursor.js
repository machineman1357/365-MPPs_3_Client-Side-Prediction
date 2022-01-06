import { socket } from "./client.js";
import { Cursor } from "./cursor.js";
import { players } from "./playersManager.js";

export let localPlayerCursor;
let wasLastSamePositionSent = false; // purpose: if mouse is flicked off screen, then last position that would be sent would be wrong

export function playerCursor_initialize() {
	create_playerCursor();
}

function create_playerCursor() {
	// set move event
	document.body.addEventListener("mousemove", function(ev) {
        if(socket && players[socket.id]) {
            players[socket.id].cursor.moveCursor(ev.clientX, ev.clientY);
        }
	});

	const playerCursor = new Cursor();
    localPlayerCursor = playerCursor;
}

export function sendPosition() {
    if(!socket) return;
    if(!players[socket.id]) return;
    const playerCursor = players[socket.id].cursor;
    if(playerCursor.lastPosition.x === playerCursor.position.x && playerCursor.lastPosition.y === playerCursor.position.y) {
        if(wasLastSamePositionSent) return;
        else {
            wasLastSamePositionSent = true;
            socket.emit("receivePlayerPosition", playerCursor.position.x, playerCursor.position.y);
            return;
        }
    } else {
        wasLastSamePositionSent = false;
    }
    socket.emit("receivePlayerPosition", playerCursor.position.x, playerCursor.position.y);
}