import { sendPosition } from "./playerCursor.js";
import { update_playerCursors } from "./playersManager.js";

export let delta;
export let timeElapsed = 0;
let lastDate = new Date();

export let sendPositionIntervalRate_ms = 100;
let sendPositionInterval;

export function update_initialize() {
	setInterval(update, 1000 / 30);
    setSendPositionInterval(sendPositionIntervalRate_ms);
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

export function setSendPositionInterval(newSendPositionIntervalRate_ms) {
    if(sendPositionInterval) {
        clearInterval(sendPositionInterval);
    }
    sendPositionIntervalRate_ms = newSendPositionIntervalRate_ms;
    sendPositionInterval = setInterval(sendPosition, sendPositionIntervalRate_ms);
}