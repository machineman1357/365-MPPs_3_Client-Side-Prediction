import { sendPosition } from "./playerCursor.js";
import { update_playerCursors } from "./playersManager.js";

export let delta;
export let timeElapsed = 0;
let lastDate = new Date();
const SEND_POSITION_INTERVAL_PER_SECOND = 20;

export function update_initialize() {
	setInterval(update, 1000 / 30);
    setInterval(sendPosition, 1000 / SEND_POSITION_INTERVAL_PER_SECOND);
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
    update_playerCursors();
}