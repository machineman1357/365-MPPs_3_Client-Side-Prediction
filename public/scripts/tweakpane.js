import { sendPositionIntervalRate_ms, setSendPositionInterval } from "./update.js";

let pane;

export function tweakpane_start() {
    const PARAMS = {
        "send position interval": sendPositionIntervalRate_ms
    }

    pane = new Tweakpane.Pane();
    pane.addInput(PARAMS, "send position interval", {
        min: 0,
        max: 1000,
        step: 1
    }).on("change", (ev) => {
        setSendPositionInterval(ev.value);
    });
}
