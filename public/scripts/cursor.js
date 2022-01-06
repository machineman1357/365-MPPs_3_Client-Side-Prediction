let ref_cursors_container;
let ref_cursor_container_template;

export function cursor_initialize() {
    ref_cursors_container = document.querySelector("#cursors_container");
    ref_cursor_container_template = document.querySelector(
        ".cursor_container_template"
    );
}

const stepsNeededForRotate = 2;
const extraRotationDegree = 25;
const OTHER_PLAYER_CURSOR_POSITION_LERP_RATE = 0.5;

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
        this.colorDegree = options.colorDegree || 0;
        this.name;
        this.stepsTakenBeforeRotate = 0;

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

    moveCursor(x, y) {
        this.containerEl.style.left = this.position.x + "px";
        this.containerEl.style.top = this.position.y + "px";
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    rotateCursor() {
        if (this.stepsTakenBeforeRotate === stepsNeededForRotate) {
            this.stepsTakenBeforeRotate = 0;
            if(this.lastPositionForRotation.x === this.position.x && this.lastPositionForRotation.y === this.position.y) return;
            const { x, y, angle } = getNormalizedDirectionAndAngle(
                this.position.x,
                this.position.y,
                this.lastPositionForRotation.x,
                this.lastPositionForRotation.y
            );
            let degree = (-angle * 180) / Math.PI;
            degree += extraRotationDegree;
            this.cursorImageEl.style.transform = "rotate(" + degree + "deg)";
            this.cursorBackgroundEl.style.transform =
                "rotate(" + degree + "deg)";

            this.lastPositionForRotation.x = this.position.x;
            this.lastPositionForRotation.y = this.position.y;
        } else {
            this.stepsTakenBeforeRotate += 1;
        }
    }

    update() {
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
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

        const lerp = (x, y, a) => x * (1 - a) + y * a;
        this.setPosition(
            lerp(this.position.x, this.lastReceivedPosition.x, OTHER_PLAYER_CURSOR_POSITION_LERP_RATE),
            lerp(this.position.y, this.lastReceivedPosition.y, OTHER_PLAYER_CURSOR_POSITION_LERP_RATE)
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
