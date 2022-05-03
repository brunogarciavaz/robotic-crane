"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
function createStore(crane) {
    return new Proxy(crane, {
        set(target, key, value) {
            switch (key) {
                case 'lift_elevation_mm': {
                    // TODO: check for constraints here
                    const heightLimit = target.constraints.lift_height_mm
                        - target.constraints.gripper_height_mm;
                    if (value > heightLimit) {
                        (0, helpers_1.animate)(target[key], heightLimit, 3, (currLerp) => { target[key] = currLerp; });
                        return true;
                    }
                    (0, helpers_1.animate)(target[key], value, 3, (currLerp) => { target[key] = currLerp; });
                    return true;
                }
                case 'rail_position_mm': {
                    // TODO: check for constraints here
                    if (value > target.constraints.rail_length_mm)
                        return true;
                    (0, helpers_1.animate)(target[key], value, 3, (currLerp) => { target[key] = currLerp; });
                    return true;
                }
                case 'swing_rot_deg': {
                    // TODO: check for constraints here
                    // if(value > target.constraints.rail_length_mm) return true
                    (0, helpers_1.animate)(target[key], value, 0.5, (currLerp) => { target[key] = currLerp; });
                    return true;
                }
                default:
                    return true;
            }
        },
    });
}
exports.default = createStore;
//# sourceMappingURL=store.js.map