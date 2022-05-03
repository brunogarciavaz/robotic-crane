import ICrane from "../interfaces/crane";

/**
 * Ties the three.js group with the data 
 */
export default function createStore(crane: ICrane, craneModel: THREE.Group) {
    const rail = craneModel.getObjectByName("rail");
    const lift = craneModel.getObjectByName("lift");
    const gripper = craneModel.getObjectByName("gripper");
    if (!rail || !lift || !gripper) throw new Error("Could not find crane parts")

    const railOffsetY = rail.position.y
    const gripperOffsetX = gripper.position.x
    return new Proxy(crane, {
        set: function (target, key, value) {

            switch (key) {
                case 'lift_elevation_mm':
                    target[key] = value
                    rail.position.y = (value / 1000) - railOffsetY
                    return true

                    break;
                case 'rail_position_mm':
                    target[key] = value
                    gripper.position.x = (value / 1000) - gripperOffsetX
                    return true

                    break;
                case 'swing_rot_deg':
                    target[key] = value
                    lift.rotation.y = 2 * Math.PI * (value / 360)
                    return true
                    break;
                default:
                    return true
                    break;
            }
        }
    })
}