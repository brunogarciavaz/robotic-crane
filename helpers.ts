export function lerp(start: number, end: number, step: number) {
  return start * (1 - step) + end * step;
}

export function animate(start: number, end: number, speed: number, cb: (currLerp: number) => void) {
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

export function objDiff<T extends {[key: string]: any}>(obj1: T, obj2: T): Partial<T> {
  return Object.entries(obj1).reduce((diff, [key, value]) => {
    if (obj2.hasOwnProperty(key)) {
      const val = obj2[key];
      if (val !== value) {
        return {
          ...diff,
          [key]: val,
        };
      }
    }
    return diff;
  }, {});
}
