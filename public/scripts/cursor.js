import { Lerp, LerpDegrees } from "./utility.js";

let ref_cursors_container;
let ref_cursor_container_template;

export function cursor_initialize() {
    ref_cursors_container = document.querySelector("#cursors_container");
    ref_cursor_container_template = document.querySelector(
        ".cursor_container_template"
    );
}

const extraRotationDegree = 25;
const OTHER_PLAYER_CURSOR_POSITION_LERP_RATE = 0.5;
const moveSpeed = 10;

export class Cursor {
    constructor(options) {
        options = options || {};

        this.containerEl;
        this.cursorBackgroundEl;
        this.cursorImageEl;
        this.cursorNameEl;

        this.position = { x: options.x || 0, y: options.y || 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.lastPositionForRotation = { x: 0, y: 0 };
        this.rotation_deg = 0;
        this.targetRotation_deg = 0;
        this.targetRotationXY = {
            x: 0,
            y: 0,
        };
        this.colorDegree = options.colorDegree || 0;
        this.name;

        this.createEl();
        this.moveCursor(this.position.x, this.position.y);
    }

    createEl() {
        const cursorContainerEl = ref_cursor_container_template.cloneNode(true);
        cursorContainerEl.classList.remove("cursor_container_template");
        ref_cursors_container.appendChild(cursorContainerEl);

        this.containerEl = cursorContainerEl;
        this.cursorBackgroundEl =
            cursorContainerEl.querySelector(".cursor_background");
        this.cursorImageEl = cursorContainerEl.querySelector(".cursor_image");
        this.cursorNameEl = cursorContainerEl.querySelector(".cursor_name");
    }

    setCursorColor(colorDegree) {
        this.colorDegree = colorDegree;
        this.cursorBackgroundEl.style.backgroundColor =
            "hsl(" + this.colorDegree + "deg 100% 50%)";
    }

    resetColor() {
        this.cursorBackgroundEl.style.backgroundColor = "hsl(0deg 0% 100%)";
    }

    moveCursor() {
        this.containerEl.style.left = this.position.x + "px";
        this.containerEl.style.top = this.position.y + "px";
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    setTargetRotationFromPointer(pointerX, pointerY) {
        const { x, y, angle } = getNormalizedDirectionAndAngle(
            this.position.x,
            this.position.y,
            pointerX,
            pointerY,
        );
        this.targetRotation_deg = (angle * 180) / Math.PI;
        this.targetRotation_deg -= extraRotationDegree + 180;
        this.targetRotation_deg *= -1;

        this.targetRotationXY.x = x;
        this.targetRotationXY.y = y;
    }

    setPositionFromTargetRotation() {
        const newPos = {
            x: this.targetRotationXY.x * moveSpeed + this.position.x,
            y: this.targetRotationXY.y * moveSpeed + this.position.y,
        };
        this.setPosition(newPos.x, newPos.y);
    }

    setRotation_deg(degree) {
        this.rotation_deg = degree;
        this.cursorBackgroundEl.style.transform =
            "rotate(" + this.rotation_deg + "deg)";
        this.cursorImageEl.style.transform =
            "rotate(" + this.rotation_deg + "deg)";
    }

    rotateCursor() {
        if (
            this.lastPositionForRotation.x === this.position.x &&
            this.lastPositionForRotation.y === this.position.y
        ) {
            return;
        }
        this.setRotation_deg(
            LerpDegrees(this.rotation_deg, this.targetRotation_deg, 0.5)
        );

        this.lastPositionForRotation.x = this.position.x;
        this.lastPositionForRotation.y = this.position.y;
    }

    update() {
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.setPositionFromTargetRotation();
        this.moveCursor();

        this.rotateCursor();
    }

    destroy() {
        this.containerEl.remove();
    }
}

export class OtherPlayerCursor extends Cursor {
    constructor(options) {
        super(options);

        this.lastReceivedPosition = { x: 0, y: 0 };
    }

    setLastReceivedPosition(x, y) {
        this.lastReceivedPosition.x = x;
        this.lastReceivedPosition.y = y;
    }

    update() {
        super.update();

        this.setPosition(
            Lerp(
                this.position.x,
                this.lastReceivedPosition.x,
                OTHER_PLAYER_CURSOR_POSITION_LERP_RATE
            ),
            Lerp(
                this.position.y,
                this.lastReceivedPosition.y,
                OTHER_PLAYER_CURSOR_POSITION_LERP_RATE
            )
        );
    }
}

function getNormalizedDirectionAndAngle(x1, y1, x2, y2) {
    const dirX = x2 - x1;
    const dirY = y2 - y1;

    let length = Math.sqrt(dirX * dirX + dirY * dirY);
    if (length === 0) {
        length = 1;
    }

    const ndx = dirX / length; // x normalized
    const ndy = dirY / length;

    const angle = Math.atan2(ndx, ndy);

    return { x: ndx, y: ndy, angle: angle };
}
