import * as THREE from 'three';
import ICrane from '../interfaces/crane';

export default function buildCraneModel(crane: ICrane) {
  const craneGroup = new THREE.Group();

  // TODO: Move all this information to crane model on the backend
  const lift_width_m = 1;
  const rail_height_m = 0.20;
  const base_height_m = 0.50;
  const gripper_height_m = crane.constraints.gripper_height_mm / 1000;
  const gripper_length_m = 1;
  const lift_height_m = crane.constraints.lift_height_mm / 1000;
  const rail_length_m = crane.constraints.rail_length_mm / 1000;

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(2, base_height_m, 2),
    new THREE.MeshBasicMaterial({ color: '#002776' }),
  );
  base.translateY(base_height_m / 2);

  const lift = new THREE.Mesh(
    new THREE.BoxGeometry(lift_width_m, lift_height_m, 1),
    new THREE.MeshBasicMaterial({ color: '#009c3b' }),
  );
  lift.name = 'lift';
  base.add(lift);
  lift.translateY((lift_height_m) / 2 + (base_height_m / 2));

  const rail = new THREE.Mesh(
    new THREE.BoxGeometry((rail_length_m), rail_height_m, 1),
    new THREE.MeshBasicMaterial({ color: '#ffdf00' }),
  );
  rail.name = 'rail';
  lift.add(rail);
  rail.translateX(((rail_length_m) / 2) + (lift_width_m / 2));
  rail.translateY((lift_height_m / 2) - (rail_height_m / 2) - gripper_height_m);

  const gripper = new THREE.Mesh(
    new THREE.BoxGeometry(gripper_length_m, gripper_height_m, 1),
    new THREE.MeshBasicMaterial({ color: 'red' }),
  );
  gripper.name = 'gripper';
  rail.add(gripper);
  gripper.translateY(-((gripper_height_m / 2) + (rail_height_m / 2)));
  gripper.translateX((rail_length_m / 2) - (gripper_length_m / 2));

  craneGroup.add(base);

  return craneGroup;
}
