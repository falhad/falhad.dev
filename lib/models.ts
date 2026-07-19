// Single source of truth for the 3D model asset URLs. Both the scene (which
// loads them via useGLTF) and the early prefetcher read from here so the two
// can never drift apart.
export const MODEL_URLS = [
  "/models/macbook.glb",
  "/models/mug_latte.glb",
  "/models/computer_desk.glb",
  "/models/notebook_and_pen.glb",
  "/models/small_flower._polycam_app.glb",
  "/models/desk_lamp.glb",
  "/models/phone.glb",
  "/models/minions.glb",
  "/models/rubik.glb",
  "/models/drone.glb",
  "/models/bose_speaker.glb",
] as const
