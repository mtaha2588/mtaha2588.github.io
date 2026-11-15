/**
 * ============================================================
 *  YOUR PERSONAL DETAILS: edit this file first.
 * ============================================================
 * Everything personal on the site is read from here.
 *
 * Empty strings ("") mean "not provided": the matching link, button or
 * block is hidden instead of showing a broken link. While running
 * `npm run dev`, the browser console lists fields that are still empty.
 */
export const profile = {
  name: "Muhammad Taha",
  // Shown in the navbar logo. Usually your initials.
  initials: "MT",

  title: "AI Developer | AI Automation Engineer | Full-Stack Developer",
  headline: "Building Intelligent Systems. Automating the Future.",
  // The hero's client-facing value line.
  valueLine: "I build AI automations, machine-learning systems and websites that save businesses time.",
  intro:
    "Mechatronics engineer (NUST) working across hardware, software and control systems. I turn business problems into working AI automations, computer-vision and machine-learning models, web apps and satellite-data analysis.",

  location: "Rawalpindi, Pakistan",
  timezones: "Based in Pakistan · Works with US/UK/EU time zones",

  // Contact & social. Use full URLs.
  email: "sigmaemenent@gmail.com",
  linkedin: "",
  github: "https://github.com/mtaha2588",
  links: {
    // Optional. Each one stays hidden until filled in.
    whatsapp: "", // international format, digits only after "+", e.g. "+923001234567"
    fiverr: "",
    upwork: "",
    calendly: "", // e.g. "https://calendly.com/yourname/30min"; "Book a free call" uses it when set
  },

  // Résumé: put your PDF at frontend/public/resume.pdf and set resumeUrl to "/resume.pdf".
  resumeUrl: "",

  availability: {
    // Set open to false to hide the green "available" indicator.
    open: true,
    label: "Available for freelance & remote work",
    detail: "Taking on freelance projects and open to remote roles with startups and small businesses.",
  },

  // Short facts shown in the hero's trust strip (text only, no logos).
  trust: [
    "NUST Mechatronics Engineering",
    "IEEE conference paper co-author",
    "Internships: NDMA · NICAT/NASTAP · NCRA",
  ],

  about: {
    paragraphs: [
      "I'm Muhammad Taha, a Mechatronics Engineering graduate of NUST (class of 2026) based in Rawalpindi, Pakistan. Mechatronics trained me to think in whole systems: sensors and hardware, the software that reads them, and the control logic that acts on them. I bring that same end-to-end view to AI and software projects.",
      "My work spans machine learning and computer vision (including CNN models and satellite imagery), AI automation, and full-stack web development. I co-authored an IEEE conference paper on machine-learning-based energy prediction for hybrid solar-wind energy harvesters, and I've worked on web, portal and data projects during internships at NDMA, NICAT/NASTAP and NCRA.",
      "Today I help startups and small businesses with AI automations, ML and computer-vision systems, business websites and web apps, and geospatial analysis with Google Earth Engine. Every case study on this site states its real status, so you can see exactly what is built and what is in progress.",
    ],
    // Shown as focus areas and in the 3D identity panel.
    interests: [
      "AI automation & agents",
      "Machine learning & computer vision",
      "Business websites & web apps",
      "Geospatial & satellite-data analysis",
    ],
    principles: [
      {
        title: "Practical over impressive",
        text: "I start from the problem and the people affected by it, then choose the simplest technology that solves it reliably.",
      },
      {
        title: "Systems thinking",
        text: "Mechatronics taught me to design across hardware, software and control. I look at how every part of a solution fits together.",
      },
      {
        title: "Honest scoping",
        text: "I communicate clearly about what is built, what is in progress and what is planned, with no inflated claims.",
      },
      {
        title: "Automation with oversight",
        text: "Automated workflows should be observable, logged and easy to review, with a human in the loop where decisions matter.",
      },
    ],
  },
};

/** Returns the names of profile fields that are still empty. */
export function missingProfileFields() {
  const missing = [];
  if (!profile.email) missing.push("email");
  if (!profile.linkedin) missing.push("linkedin");
  if (!profile.resumeUrl) missing.push("resumeUrl");
  for (const [k, v] of Object.entries(profile.links)) if (!v) missing.push(`links.${k} (optional)`);
  return missing;
}
