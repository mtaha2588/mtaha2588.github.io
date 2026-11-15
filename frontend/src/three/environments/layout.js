/**
 * Placement of the Stage 4 environments on an outer ring around the
 * exhibitions. Each camera looks outward (from the centre of the scene
 * towards the environment), so these content-heavy sections get a clean
 * deep-space background. Plain numbers only: imported by the HUD too.
 *
 * Camera heights are chosen so the paths between stations fly *over* the
 * exhibitions rather than through them.
 */
export const ENVIRONMENTS = {
  // Holographic screening room: every project's real screenshot on a curved wall of screens.
  gallery: {
    key: "gallery",
    sectionId: "gallery",
    label: "Project Gallery",
    position: [36, -1, 20],
    azimuth: -2.08, // faces back towards the globe
    distance: 19,
    height: 3.6,
    // Phones: a taller 2 × 3 wall (see ProjectGallery), so aim higher and stand further back.
    mobile: { distance: 35, height: 8, targetY: 3.4 },
  },
  lab: {
    key: "lab",
    sectionId: "lab",
    label: "AI Workflow Lab",
    position: [40, -1, -28],
    azimuth: -0.96,
    distance: 23,
    height: 10,
  },
  skills: {
    key: "skills",
    sectionId: "skills",
    label: "Skills Constellation",
    position: [0, 4, -60],
    azimuth: 0,
    distance: 27,
    height: 3,
    mobile: { distance: 34, height: 5, targetY: -6 },
  },
  about: {
    key: "about",
    sectionId: "about",
    label: "Identity",
    position: [-40, 1, -28],
    azimuth: 0.96,
    distance: 15,
    height: 3.5,
  },
  contact: {
    key: "contact",
    sectionId: "contact",
    label: "Transmission",
    position: [-34, 3, 18],
    azimuth: 2.0,
    distance: 15,
    height: 6,
  },
};
