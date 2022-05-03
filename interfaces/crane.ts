
export default interface ICrane {
  constraints: {
    lift_height_mm: number,
    rail_length_mm: number,
    gripper_height_mm: number,
  }
  swing_rot_deg: number,
  lift_elevation_mm: number,
  rail_position_mm: number,
  wrist_rotation_deg: number,
  gripper_state: boolean,

}