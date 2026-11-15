/**
 * Service packages and the working process. No imports (Node reads this
 * file at build time for structured data).
 *
 * startingPrice: a number in USD shows "Starting from $X". Leave it null
 * to show "Custom quote" until you've decided on a price.
 * delivery: typical timeline shown on the card. Adjust to what you can commit to.
 */
export const SERVICES = [
  {
    id: "ai-automation",
    icon: "bot",
    title: "AI Automation & Agents",
    summary: "Automate repetitive work with AI: workflows that read, sort, summarise and act on your data.",
    forWho: "Startups and small teams losing hours to copy-paste work, inbox triage or manual reporting.",
    deliverables: [
      "Workflow or AI agent connected to your tools and APIs",
      "Clear logs and a human-review step where it matters",
      "Setup guide and handover call",
    ],
    delivery: "Typically 1–3 weeks",
    startingPrice: null,
  },
  {
    id: "ml-cv",
    icon: "brain",
    title: "Machine Learning & Computer Vision",
    summary: "Models that learn from your data: prediction, classification and image analysis with CNNs.",
    forWho: "Businesses and researchers with data or images they want to turn into predictions or insights.",
    deliverables: [
      "Data preparation and a trained, evaluated model",
      "Honest evaluation report (what works, what doesn't)",
      "Code you own, plus an inference script or simple API",
    ],
    delivery: "Typically 2–4 weeks",
    startingPrice: null,
  },
  {
    id: "web",
    icon: "globe",
    title: "Business Websites & Web Apps",
    summary: "Fast, modern websites and web apps that present your business well and work on every device.",
    forWho: "Small businesses that need a professional site, or startups that need an MVP web app.",
    deliverables: [
      "Responsive website or web app (React / Python back end)",
      "Basic SEO, contact form and analytics setup",
      "Deployment to your domain and a handover guide",
    ],
    delivery: "Typically 1–4 weeks",
    startingPrice: null,
  },
  {
    id: "geospatial",
    icon: "map",
    title: "Data & Geospatial Analysis",
    summary: "Satellite imagery and spatial data analysis with Google Earth Engine, Python and maps.",
    forWho: "NGOs, researchers and companies working with land, water, snow, glaciers or infrastructure data.",
    deliverables: [
      "Google Earth Engine scripts and processed datasets (GeoTIFF / CSV)",
      "Maps, charts and a short findings report",
      "Reproducible pipeline you can run again",
    ],
    delivery: "Typically 1–3 weeks",
    startingPrice: null,
  },
];

export const PROCESS = [
  { title: "Free call", text: "A short call to understand your problem, goals and timeline. No obligation." },
  {
    title: "Fixed quote",
    text: "A clear written scope with deliverables, timeline and a fixed price before any work starts.",
  },
  {
    title: "Build with weekly updates",
    text: "You see progress every week, with demos you can try and feedback built in.",
  },
  {
    title: "Delivery & 2 weeks support",
    text: "Handover of everything you paid for, documentation, and two weeks of support.",
  },
];

export const BUDGETS = ["Under $500", "$500 – $1,000", "$1,000 – $3,000", "$3,000+", "Not sure yet"];
