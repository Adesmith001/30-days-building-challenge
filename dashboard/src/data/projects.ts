export type ProjectStatus = "completed";

export type ProjectImage = {
  src: string;
  alt: string;
};

export type Project = {
  day: number;
  title: string;
  tagline: string;
  description: string;
  date: string;
  status: ProjectStatus;
  stack: string[];
  images: ProjectImage[];
  liveUrl: string;
  githubUrl: string;
  learned: string;
};

export const challengeStartDate = "2026-09-01";

export const projects: Project[] = [
  /*{
    day: 1,
    title: "Project 1",
    tagline: "A simple project",
    description: "This is a simple project to get started with.",
    date: "2026-09-01",
    status: "completed",
    stack: ["React", "TypeScript"],
    images: [
      {
        src: "/images/project1.jpg",
        alt: "Project 1"
      },
      {
        src: "/images/project1-2.jpg",
        alt: "Project 1 - Screenshot 2"
      }
    ],
    liveUrl: "https://project1.com",
    githubUrl: "https://github.com/user/project1",
    learned: "I learned how to create a basic React component."
  }*/
];
