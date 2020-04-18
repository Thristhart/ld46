import { buildBehavior } from "./behavior";
import Vector from "victor";
import { Kinematic } from "./kinematic";

let hasClicked = false;
window.addEventListener("click", () => {
    hasClicked = true;
});

export const ClickToBounce = buildBehavior(Kinematic.properties, (ent, dt) => {
    if (hasClicked) {
        ent.acceleration.subtractScalarY(400);
        if (ent.velocity.y > 0) {
            ent.velocity.y = 0;
        }
        hasClicked = false;
    }
});
