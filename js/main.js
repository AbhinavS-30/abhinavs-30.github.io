// main.js
// Fetches data/projects.json and data/profile.json, then renders
// them into the empty containers we set up in index.html.

// ---------------------------------------------------------------
// HEADSHOT FALLBACK
// ---------------------------------------------------------------
// If assets/images/headshot.jpg doesn't exist (or fails to load for any
// reason), the browser fires an "error" event on the <img> instead of
// throwing — we listen for it and just hide the element, so a missing
// photo never shows a broken-image icon or leaves a layout gap.
const headshot = document.getElementById("headshot");
headshot.addEventListener("error", () => {
  headshot.style.display = "none";
});

// ---------------------------------------------------------------
// MOBILE NAV TOGGLE
// ---------------------------------------------------------------

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen); // drives the bars->X animation in CSS
});

// Close the menu automatically once a link is tapped, so it doesn't
// stay open covering the section the visitor just navigated to.
navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ---------------------------------------------------------------
// PROJECTS DATA
// ---------------------------------------------------------------

const featuredContainer = document.getElementById("featured-projects");
const moreListContainer = document.getElementById("more-projects-list");

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");
    const projects = await response.json();

    // .filter() keeps only the items where the callback returns true —
    // same idea as a boolean mask in pandas: df[df["featured"] == True]
    const featured = projects.filter((project) => project.featured);
    const more = projects.filter((project) => !project.featured);

    renderFeaturedProjects(featured);
    renderMoreProjects(more);
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
}

function renderFeaturedProjects(projects) {
  // .map() turns each project object into an HTML string; .join("")
  // glues that array of strings into one string we can hand to innerHTML.
  featuredContainer.innerHTML = projects
    .map(
      (project) => `
    <article class="project-card">
      <img src="${project.imageUrl}" alt="${project.imageAlt}" class="project-image" />
      <div class="project-card-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tech-tags">
          ${project.tech.map((tag) => `<span class="tech-tag">${tag}</span>`).join("")}
        </div>
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
          View on GitHub →
        </a>
      </div>
    </article>
  `
    )
    .join("");
}

// Compact list — one <li> per non-featured project, just a title,
// one-line description, and a GitHub link. Renders empty right now
// since every current project is featured: true — that's expected.
// It'll fill in automatically the moment you add a project with
// "featured": false to data/projects.json.
function renderMoreProjects(projects) {
  moreListContainer.innerHTML = projects
    .map(
      (project) => `
    <li>
      <strong>${project.title}</strong> — ${project.description}
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub →</a>
    </li>
  `
    )
    .join("");
}

// ---------------------------------------------------------------
// PROFILE DATA (experience, education, skills)
// ---------------------------------------------------------------

const timelineContainer = document.getElementById("experience-timeline");
const educationContainer = document.getElementById("education-list");
const skillsContainer = document.getElementById("skills-groups");

async function loadProfile() {
  try {
    const response = await fetch("data/profile.json");
    const profile = await response.json();

    renderExperience(profile.experience);
    renderEducation(profile.education);
    renderSkills(profile.skills);
  } catch (error) {
    console.error("Failed to load profile:", error);
  }
}

function renderExperience(experience) {
  timelineContainer.innerHTML = experience
    .map(
      (job) => `
    <li class="timeline-item">
      <div class="timeline-header">
        <h4>${job.role} · ${job.company}</h4>
        <span class="timeline-dates">${job.startDate} – ${job.endDate}</span>
      </div>
      <p class="timeline-location">${job.location}</p>
      <p>${job.description}</p>
    </li>
  `
    )
    .join("");
}

function renderEducation(education) {
  educationContainer.innerHTML = education
    .map(
      (entry) => `
    <li>
      <strong>${entry.degree}</strong> — ${entry.school} (${entry.year})
    </li>
  `
    )
    .join("");
}

// `skills` isn't an array like the other two — it's an object where
// each key is a category name and each value is an array of skill
// strings (like a dict of lists, or a pandas groupby result). We use
// Object.entries() to turn { "Programming": [...] } into
// [ ["Programming", [...]], ... ] so we can .map() over it the same way.
function renderSkills(skills) {
  skillsContainer.innerHTML = Object.entries(skills)
    .map(
      ([category, items]) => `
    <div class="skill-group">
      <h3>${category}</h3>
      <ul class="skill-tags">
        ${items.map((item) => `<li class="skill-tag">${item}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");
}

// ---------------------------------------------------------------
// RUN
// ---------------------------------------------------------------

loadProjects();
loadProfile();

console.log("main.js is connected!");
