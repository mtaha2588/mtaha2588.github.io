/**
 * Technical skills, grouped into the eight areas of the skills
 * constellation. A skill may appear in several areas: shared skills
 * become the lines connecting areas in 3D.
 *
 * Proficiency levels are deliberately NOT shown. If you want to add one,
 * also add evidence (a link to a repo, certificate or project), e.g.
 *   { name: "Python", level: "Advanced", evidence: "https://github.com/you/repo" }
 * "Used in" projects are derived automatically from projects.json.
 */
export const SKILL_AREAS = [
  { id: "ai", title: "Artificial Intelligence", color: "#ff8a94", skills: ["LLMs", "OpenAI API", "Claude API"] },
  { id: "ml", title: "Machine Learning", color: "#e8505d", skills: ["Scikit-learn", "Random Forest", "SVM"] },
  { id: "agents", title: "AI Agents", color: "#ff9aa3", skills: ["AI agents", "LLMs", "Workflow automation"] },
  { id: "python", title: "Python Development", color: "#ff2a3d", skills: ["Python", "FastAPI", "Flask"] },
  {
    id: "fullstack",
    title: "Full-Stack Development",
    color: "#ff5563",
    skills: ["JavaScript", "React", "Tailwind CSS", "HTML", "CSS", "SQL"],
  },
  { id: "api", title: "API Integrations", color: "#ff7a85", skills: ["REST APIs", "API integration", "FastAPI"] },
  {
    id: "automation",
    title: "Automation Engineering",
    color: "#ff6b78",
    skills: ["Workflow automation", "API integration", "Python", "Git", "GitHub"],
  },
  {
    id: "geo",
    title: "Geospatial Intelligence",
    color: "#e11d2e",
    skills: ["Geospatial data processing", "DEM", "Satellite data"],
  },
];

/** Projects whose technology list includes this skill (case-insensitive). */
export function projectsUsing(skill, projects) {
  const s = skill.toLowerCase();
  return projects.filter((p) => p.technologies.some((t) => t.toLowerCase() === s));
}
