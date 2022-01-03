import { sendPosition } from "./playerCursor.js";
import { update_playerCursors } from "./playersManager.js";

export let delta;
export let timeElapsed = 0;
let lastDate = new Date();

export function update_initialize() {
	setInterval(update, 1000 / 30);
    setInterval(sendPosition, 1000 / 10);
    setInterval(update_playerCursors, 1000 / 30);
}

function update() {
	setDelta();
	callUpdatesInOtherScripts();
	timeElapsed += delta;
}

function setDelta() {
	const currentDate = new Date();
	delta = currentDate - lastDate;
	lastDate = currentDate;
}

function callUpdatesInOtherScripts() {

}