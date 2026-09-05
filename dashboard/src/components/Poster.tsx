import type { Project } from "../data/projects";
import { padDay } from "../lib/challenge";

export function Poster({ project }: { project: Project }) {
  return (
    <div className="poster" aria-hidden="true">
      <div className="poster__index">DAY {padDay(project.day)}</div>
      <div className="poster__mark">{project.title.slice(0, 2).toUpperCase()}</div>
      <div className="poster__rule" />
      <div className="poster__caption">{project.stack.join(" / ")}</div>
    </div>
  );
}
