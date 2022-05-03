import ICrane from './interfaces/crane';
import { animate } from './helpers';

export default function createStore(crane: ICrane) {
  return new Proxy(crane, {
    set(target, key, value) {
      switch (key) {
        case 'lift_elevation_mm': {
          // TODO: check for constraints here
          const heightLimit = target.constraints.lift_height_mm
          - target.constraints.gripper_height_mm;

          if (
            value > heightLimit) {
            animate(target[key], heightLimit, 3, (currLerp) => { target[key] = currLerp; });
            return true;
          }
          animate(target[key], value, 3, (currLerp) => { target[key] = currLerp; });
          return true;
        }
        case 'rail_position_mm': {
          // TODO: check for constraints here
          if (value > target.constraints.rail_length_mm) return true;
          animate(target[key], value, 3, (currLerp) => { target[key] = currLerp; });
          return true;
        }
        case 'swing_rot_deg': {
          // TODO: check for constraints here
          // if(value > target.constraints.rail_length_mm) return true
          animate(target[key], value, 0.5, (currLerp) => { target[key] = currLerp; });
          return true;
        }

        default:
          return true;
      }
    },
  });
}
