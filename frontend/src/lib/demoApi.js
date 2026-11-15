import { apiRequest, isApiConfigured } from "./api";
import { demoLocal } from "./demoLocal";

/**
 * The per-project demos. With no backend configured (the free GitHub Pages
 * build), every call runs in the visitor's browser (lib/demoLocal.js, a port
 * of the same rules). With VITE_API_URL set, they call the FastAPI backend.
 */
const AV = "/api/demos/avalanche";
const AG = "/api/demos/automation-agent";
const CS = "/api/demos/car-sales";

const remote = {
  terrain: (size = 64, seed = 7) => apiRequest(`${AV}/terrain/sample?size=${size}&seed=${seed}`, { timeoutMs: 9000 }),
  assess: (body) => apiRequest(`${AV}/assess`, { method: "POST", body }),

  agentSamples: () => apiRequest(`${AG}/samples`),
  runAgent: (body) => apiRequest(`${AG}/run`, { method: "POST", body }),

  inventory: () => apiRequest(`${CS}/inventory`),
  createLead: (body) => apiRequest(`${CS}/leads`, { method: "POST", body }),
  pipeline: () => apiRequest(`${CS}/pipeline`),
};

export const demoApi = isApiConfigured ? remote : demoLocal;
