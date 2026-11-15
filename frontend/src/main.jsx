import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/unbounded"; // display font, self-hosted (wide, geometric headings)
import "./index.css";
import { missingProfileFields } from "./data/profile";

// Development reminder so placeholder details never ship by accident.
if (import.meta.env.DEV) {
  const missing = missingProfileFields();
  if (missing.length) console.info(`[portfolio] Fill in src/data/profile.js: ${missing.join(", ")}`);
}

// StrictMode is applied inside App.jsx (to the page content, not the 3D canvas).
createRoot(document.getElementById("root")).render(<App />);
