import { useMemo, useState } from "react";
import { challengeStartDate, projects, type Project } from "./data/projects";
import { HeroSection } from "./components/HeroSection";
import { PrinciplesSection } from "./components/PrinciplesSection";
import { ProjectArchive } from "./components/ProjectArchive";
import { ProjectModal } from "./components/ProjectModal";
import { ProgressSection } from "./components/ProgressSection";
import { ReservedSlots } from "./components/ReservedSlots";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { buildSlots, getChallengeDay } from "./lib/challenge";

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const currentDay = getChallengeDay(challengeStartDate);
  const completedProjects = projects.filter((project) => project.status === "completed");
  const latestCompletedDay = Math.max(0, ...completedProjects.map((project) => project.day));
  const slots = useMemo(() => buildSlots(projects, currentDay, challengeStartDate), [currentDay]);
  const completed = completedProjects.length;
  const remaining = 30 - completed;
  const percent = Math.round((completed / 30) * 100);

  return (
    <>
      <SiteHeader />
      <main id="top">
        <HeroSection completed={completed} percent={percent} remaining={remaining} />
        <ProgressSection completed={completed} percent={percent} slots={slots} />
        <ProjectArchive slots={slots} latestCompletedDay={latestCompletedDay} onSelectProject={setSelectedProject} />
        <ReservedSlots completed={completed} />
        <PrinciplesSection />
      </main>
      <SiteFooter />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}

export { App };
