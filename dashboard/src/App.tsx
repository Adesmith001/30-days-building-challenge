import { useEffect, useMemo, useState } from "react";
import { challengeStartDate, projects, type Project } from "./data/projects";

const TOTAL_DAYS = 30;
const ONE_DAY = 24 * 60 * 60 * 1000;

type DaySlot =
  | { day: number; status: "completed"; project: Project }
  | { day: number; status: "up-next" | "today" | "locked"; project?: never };

const padDay = (day: number) => String(day).padStart(2, "0");

function getChallengeDay() {
  const start = new Date(`${challengeStartDate}T00:00:00`);
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - start.getTime()) / ONE_DAY) + 1;

  if (elapsed < 1) return 1;
  return Math.min(elapsed, TOTAL_DAYS);
}

function buildSlots(currentDay: number): DaySlot[] {
  return Array.from({ length: TOTAL_DAYS }, (_, index) => {
    const day = index + 1;
    const project = projects.find((item) => item.day === day);

    if (project) {
      return { day, status: "completed", project };
    }

    if (day === currentDay) {
      const start = new Date(`${challengeStartDate}T00:00:00`);
      return { day, status: Date.now() < start.getTime() ? "up-next" : "today" };
    }

    return { day, status: "locked" };
  });
}

function Poster({ project }: { project: Project }) {
  return (
    <div className="poster" aria-hidden="true">
      <div className="poster__index">DAY {padDay(project.day)}</div>
      <div className="poster__mark">{project.title.slice(0, 2).toUpperCase()}</div>
      <div className="poster__rule" />
      <div className="poster__caption">{project.stack.join(" / ")}</div>
    </div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("has-modal");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("has-modal");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;
  const primaryImage = project.images[0];

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="modal__panel">
        <button className="modal__close" type="button" onClick={onClose} aria-label="Close project details">
          Close
        </button>
        <div className="modal__media">
          {primaryImage ? (
            <img src={primaryImage.src} alt={primaryImage.alt} />
          ) : (
            <Poster project={project} />
          )}
        </div>
        <div className="modal__content">
          <p className="eyebrow">DAY {padDay(project.day)} / {project.date}</p>
          <h2 id="project-modal-title">{project.title}</h2>
          <p className="modal__tagline">{project.tagline}</p>
          <p>{project.description}</p>
          <div>
            <h3>What I learned</h3>
            <p>{project.learned}</p>
          </div>
          <div>
            <h3>Pictures</h3>
            <div className="picture-grid">
              {project.images.map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
              ))}
            </div>
          </div>
          <div>
            <h3>Stack</h3>
            <ul className="tag-list" aria-label="Technology stack">
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="modal__actions">
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              View Project
            </a>
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              Source
            </a>
            {project.twitterUrl ? (
              <a href={project.twitterUrl} target="_blank" rel="noreferrer">
                Twitter
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const currentDay = getChallengeDay();
  const completedProjects = projects.filter((project) => project.status === "completed");
  const latestCompletedDay = Math.max(0, ...completedProjects.map((project) => project.day));
  const slots = useMemo(() => buildSlots(currentDay), [currentDay]);
  const completed = completedProjects.length;
  const remaining = TOTAL_DAYS - completed;
  const percent = Math.round((completed / TOTAL_DAYS) * 100);

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="30 Builds in 30 Days home">
          ADESMITH
        </a>
        <nav aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="https://github.com/Adesmith001" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/toluwani-somade-79b7b0400?" target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero__copy reveal">
            <p className="eyebrow">PERSONAL ENGINEERING CHALLENGE / 2026</p>
            <h1>30 Builds. 30 Days.</h1>
            <p>
              I am building and shipping one complete engineering project every day for a month:
              experiments, games, developer tools, AI projects, and things that probably did not need to exist.
            </p>
          </div>
          <div className="hero__status reveal">
            <span>{padDay(completed)} / {TOTAL_DAYS} SHIPPED</span>
            <strong>{percent}%</strong>
            <p>{remaining} builds remaining / starts Sep 01</p>
          </div>
        </section>

        <section className="progress section-shell" aria-labelledby="progress-title">
          <div className="section-label">
            <h2 id="progress-title">Progress Log</h2>
            <span>{padDay(completed)} / {TOTAL_DAYS} SHIPPED</span>
          </div>
          <div className="progress__bar" aria-label={`${completed} of ${TOTAL_DAYS} projects shipped`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <ol className="progress__pips" aria-label="Thirty day completion map">
            {slots.map((slot) => (
              <li key={slot.day} className={slot.status}>
                <span>{padDay(slot.day)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="projects section-shell" id="projects" aria-labelledby="projects-title">
          <div className="section-intro reveal">
            <p className="eyebrow">PROJECT ARCHIVE</p>
            <h2 id="projects-title">Every slot is visible from day one.</h2>
            <p>
              Completed builds open into a focused project sheet. Empty days stay in the grid as reserved space for the challenge.
            </p>
          </div>

          <div className="project-grid">
            {slots.map((slot) =>
              slot.status === "completed" ? (
                <article className={`project-card ${slot.day === latestCompletedDay ? "project-card--featured" : ""}`} key={slot.day}>
                  <button type="button" onClick={() => setSelectedProject(slot.project)}>
                    <span className="project-card__meta">
                      {slot.day === latestCompletedDay ? "LATEST / " : ""}DAY {padDay(slot.day)}
                    </span>
                    <div className="project-card__media">
                      {slot.project.images[0] ? (
                        <img src={slot.project.images[0].src} alt={slot.project.images[0].alt} loading="lazy" />
                      ) : (
                        <Poster project={slot.project} />
                      )}
                    </div>
                    <span className="project-card__title">{slot.project.title}</span>
                    <span className="project-card__tagline">{slot.project.tagline}</span>
                    <span className="project-card__stack">{slot.project.stack.join(" / ")}</span>
                    <span className="project-card__action">Explore Build</span>
                  </button>
                </article>
              ) : (
                <article className={`empty-card ${slot.status}`} key={slot.day} aria-label={`Day ${slot.day} not shipped yet`}>
                  <span>DAY {padDay(slot.day)}</span>
                  <strong>{slot.status === "today" ? "TODAY" : slot.status === "up-next" ? "START" : padDay(slot.day)}</strong>
                  <em>{slot.status === "today" ? "In progress" : slot.status === "up-next" ? "Sep 01" : "Not shipped yet"}</em>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="reserved section-shell" aria-label="Reserved challenge slots">
          <p>[ DAYS {padDay(completed + 1)} - {TOTAL_DAYS} ]</p>
          <strong>EXHIBITION SLOTS RESERVED.</strong>
          <span>NOT SHIPPED YET.</span>
        </section>

        <section className="principles section-shell" aria-labelledby="principles-title">
          <div className="principles__heading reveal">
            <p className="eyebrow">WHY 30?</p>
            <h2 id="principles-title">The architecture of the challenge</h2>
            <p>
              The goal is not to build thirty startups. It is to get better at turning ideas into working software.
            </p>
          </div>
          <ol className="principle-grid">
            <li>
              <span>01</span>
              <h3>Build Small.</h3>
              <p>Constrain the scope to what can be architected, developed, and deployed within one day.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Finish.</h3>
              <p>A finished imperfect project beats an unfinished perfect one. Ship the working version.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Experiment.</h3>
              <p>Use interfaces, APIs, browser technology, games, AI, and data as a daily technical lab.</p>
            </li>
            <li>
              <span>04</span>
              <h3>Ship Publicly.</h3>
              <p>Deploy, document, and make the work reachable without burying it in private folders.</p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="site-footer">
        <span>Built and shipped by Adesmith.</span>
        <nav aria-label="Footer navigation">
          <a href="https://github.com/Adesmith001" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/toluwani-somade-79b7b0400?" target="_blank" rel="noreferrer">LinkedIn</a>
          <span>2026</span>
        </nav>
      </footer>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

export { App };
