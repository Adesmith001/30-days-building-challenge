import { TOTAL_DAYS } from "../lib/challenge";

export function HeroSection({ completed, percent, remaining }: { completed: number; percent: number; remaining: number }) {
  return (
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
        <span>{String(completed).padStart(2, "0")} / {TOTAL_DAYS} SHIPPED</span>
        <strong>{percent}%</strong>
        <p>{remaining} builds remaining / starts Sep 01</p>
      </div>
    </section>
  );
}
