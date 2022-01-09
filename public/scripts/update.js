import { socket } from "./client.js";
import { addMoveToHistory } from "./clientSidePrediction.js";
import { localPlayerCursor, sendPosition } from "./playerCursor.js";
import { update_playerCursors } from "./playersManager.js";

export let delta;
export let timeElapsed = 0;
let lastDate = new Date();
const SEND_RTT_INTERVAL_MS = 1000;

export let sendPositionIntervalRate_ms = 100;
let sendPositionInterval;

export function update_initialize() {
    setInterval(update, 1000 / 30);
    setSendPositionInterval(sendPositionIntervalRate_ms);
    setInterval(sendRTTInterval, SEND_RTT_INTERVAL_MS);
}

function update() {
    setDelta();

    callUpdatesInOtherScripts();
    sendClientMove();

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
    if (sendPositionInterval) {
        clearInterval(sendPositionInterval);
    }
    sendPositionIntervalRate_ms = newSendPositionIntervalRate_ms;
    sendPositionInterval = setInterval(
        sendPosition,
        sendPositionIntervalRate_ms
    );
}

function sendRTTInterval() {
    socket.emit("requestRTT", Date.now());
}

function sendClientMove() {
    const move = {
        ts: Date.now(),
        dir: localPlayerCursor.targetRotation_deg,
    };
    socket.emit('clientMove', move);
    addMoveToHistory(move);
}
