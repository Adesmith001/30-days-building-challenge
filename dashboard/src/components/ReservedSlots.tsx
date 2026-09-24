import type { Project } from "../data/projects";
import { padDay } from "../lib/challenge";
import { Poster } from "./Poster";

export const EXHIBITION_DAYS = [6, 14, 17, 18, 22, 23] as const;

export function ReservedSlots({ projects, onSelectProject }: { projects: Project[]; onSelectProject: (project: Project) => void }) {
  const exhibitionProjects = EXHIBITION_DAYS
    .map((day) => projects.find((project) => project.day === day))
    .filter((project): project is Project => Boolean(project));

  return (
    <section className="reserved section-shell" aria-labelledby="exhibition-title">
      <header className="reserved__header">
        <div>
          <p>[ CURATED FROM THE CHALLENGE ]</p>
          <h2 id="exhibition-title">Selected for exhibition.</h2>
        </div>
        <span>{String(exhibitionProjects.length).padStart(2, "0")} PROJECTS / 30 DAYS</span>
      </header>

      <div className="reserved__grid">
        {exhibitionProjects.map((project) => (
          <article className="reserved__project" key={project.day}>
            <button type="button" onClick={() => onSelectProject(project)} aria-label={`Open Day ${project.day}: ${project.title}`}>
              {project.images[0] ? <img src={project.images[0].src} alt={project.images[0].alt} loading="lazy" /> : <Poster project={project} />}
              <span className="reserved__project-copy">
                <small>DAY {padDay(project.day)}</small>
                <strong>{project.title}</strong>
                <em>{project.tagline}</em>
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
