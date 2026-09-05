import type { Project } from "../data/projects";
import { padDay, type DaySlot } from "../lib/challenge";
import { Poster } from "./Poster";

export function ProjectArchive({ slots, latestCompletedDay, onSelectProject }: { slots: DaySlot[]; latestCompletedDay: number; onSelectProject: (project: Project) => void }) {
  return (
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
              <button type="button" onClick={() => onSelectProject(slot.project)}>
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
  );
}
