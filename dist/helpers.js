"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objDiff = exports.animate = exports.lerp = void 0;
function lerp(start, end, step) {
    return start * (1 - step) + end * step;
}
exports.lerp = lerp;
function animate(start, end, speed, cb) {
    if (start === end) {
        cb(end);
        console.error('Attempted to animate equal values');
        return;
    }
    const interval = 1000 / 60;
    const duration = Math.abs((end - start)) / speed;
    let iterations = 0;
    let step = 0;
    let currLerp = 0;
    (function loop() {
        setTimeout(() => {
            step = (iterations * interval) / duration;
            // TODO: failsafe quickfix
            if (step >= 1 || step < 0) {
                cb(end);
                return;
            }
            currLerp = lerp(start, end, step);
            cb(currLerp);
            iterations += 1;
            loop();
        }, interval);
    }());
}
exports.animate = animate;
function objDiff(obj1, obj2) {
    return Object.entries(obj1).reduce((diff, [key, value]) => {
        if (obj2.hasOwnProperty(key)) {
            const val = obj2[key];
            if (val !== value) {
                return Object.assign(Object.assign({}, diff), { [key]: val });
            }
        }
        return diff;
    }, {});
}
exports.objDiff = objDiff;
//# sourceMappingURL=helpers.js.map