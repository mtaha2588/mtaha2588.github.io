/**
 * Top-level navigation. `stations` lists which camera stations
 * (see src/three/stations.js) belong to each nav item, so the HUD can
 * highlight "Projects" while the camera visits any exhibition.
 */
export const SECTIONS = [
  { id: "home", label: "Home", stations: [0] },
  { id: "services", label: "Services", stations: [1] },
  { id: "projects", label: "Work", stations: [2, 3, 4, 5, 6] },
  { id: "lab", label: "AI Lab", stations: [7] },
  { id: "skills", label: "Skills", stations: [8] },
  { id: "about", label: "About", stations: [9] },
  { id: "contact", label: "Contact", stations: [10] },
];
