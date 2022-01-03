import { cursor_initialize } from "./cursor.js";
import { playerCursor_initialize } from "./playerCursor.js";
import "./client.js";
import { update_initialize } from "./update.js";

function initialize() {
	cursor_initialize();
	playerCursor_initialize();
    update_initialize();
}

function start() {

}

initialize();
start();

export function setBodyColor(type, args) {
    if(type === "hex") {
        document.body.style.boxShadow = "inset 0 0 0 10px " + "#" + args[0];
    } else if(type === "colorDegree") {
        document.body.style.boxShadow = "inset 0 0 0 10px " + "hsl(" + args[0] + "deg 100% 50%)";
    }
}