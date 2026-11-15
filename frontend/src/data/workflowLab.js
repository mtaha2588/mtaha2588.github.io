/**
 * The AI Workflow Laboratory: the general pipeline behind the projects.
 * Each stage lists real techniques and tools, plus which portfolio
 * project applies it (`projects` = slugs from projects.json).
 */
export const LAB_STAGES = [
  {
    id: "collect",
    title: "Data Collection",
    short: "Gather raw inputs",
    color: "#ff2a3d",
    description:
      "Pulling data from where it already lives: REST APIs, files, databases, sensors and satellite or elevation datasets. Inputs are validated on arrival so problems are caught at the edge, not three steps later.",
    techniques: ["API connectors", "File ingestion (CSV, JSON, GeoTIFF)", "Schema validation"],
    tools: ["Python", "REST APIs", "Pydantic"],
    projects: ["avalanche-intelligence-platform", "ai-business-automation-agent"],
  },
  {
    id: "process",
    title: "Data Processing",
    short: "Clean, align, enrich",
    color: "#ff5563",
    description:
      "Turning raw inputs into consistent, usable features: cleaning text, aligning rasters onto one grid, aggregating records and deriving new variables such as slope and aspect from elevation.",
    techniques: ["Cleaning & normalisation", "Feature engineering", "Geospatial alignment"],
    tools: ["Python", "SQL", "Geospatial data processing"],
    projects: ["avalanche-intelligence-platform", "ai-enabled-car-sales-platform"],
  },
  {
    id: "analyse",
    title: "AI Analysis",
    short: "Models find patterns",
    color: "#e8505d",
    description:
      "Applying the right model for the job: classical machine learning (Random Forest, SVM) for structured and geospatial data, and large language models for understanding and summarising text.",
    techniques: ["Supervised classification", "LLM summarisation & extraction", "Model evaluation"],
    tools: ["Scikit-learn", "OpenAI API", "Claude API"],
    projects: ["avalanche-intelligence-platform", "ai-business-automation-agent"],
  },
  {
    id: "decide",
    title: "Intelligent Decision",
    short: "Rules + model output",
    color: "#ff8a94",
    description:
      "Combining model output with explicit business rules to decide what happens next: prioritising, routing, scoring or flagging. Decisions stay explainable, and sensitive ones can require human approval.",
    techniques: ["Scoring & prioritisation", "Routing rules", "Human-in-the-loop review"],
    tools: ["Python", "AI agents"],
    projects: ["ai-business-automation-agent", "ai-enabled-car-sales-platform"],
  },
  {
    id: "output",
    title: "Automated Output",
    short: "Act and report",
    color: "#ff7a85",
    description:
      "Delivering the result where people need it: generated reports, notifications, dashboard and map updates, or API calls into other systems. Every run is logged so it can be audited.",
    techniques: ["Report generation", "Notifications", "Logging & audit trail"],
    tools: ["FastAPI", "Flask", "Workflow automation"],
    projects: ["ai-business-automation-agent", "ai-enabled-car-sales-platform"],
  },
];
