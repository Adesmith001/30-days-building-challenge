import { useEffect, useState } from "react";
import type { Project } from "../data/projects";
import { padDay } from "../lib/challenge";
import { Poster } from "./Poster";

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!project) {
      setGalleryIndex(null);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (galleryIndex !== null) setGalleryIndex(null);
        else onClose();
      }

      if (galleryIndex !== null && project.images.length > 1) {
        if (event.key === "ArrowRight") {
          setGalleryIndex((index) => index === null ? null : (index + 1) % project.images.length);
        }
        if (event.key === "ArrowLeft") {
          setGalleryIndex((index) => index === null ? null : (index - 1 + project.images.length) % project.images.length);
        }
      }
    };

    document.body.classList.add("has-modal");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("has-modal");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [galleryIndex, onClose, project]);

  if (!project) return null;
  const primaryImage = project.images[0];
  const galleryImage = galleryIndex === null ? null : project.images[galleryIndex];
  const openGallery = (index: number) => setGalleryIndex(index);
  const moveGallery = (direction: number) => {
    if (project.images.length < 2) return;
    setGalleryIndex((index) => index === null ? 0 : (index + direction + project.images.length) % project.images.length);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal__panel">
        <button className="modal__close" type="button" onClick={onClose} aria-label="Close project details">Close</button>
        <div className="modal__media">
          {primaryImage ? (
            <button className="modal__media-button" type="button" onClick={() => openGallery(0)} aria-label="Open image gallery">
              <img src={primaryImage.src} alt={primaryImage.alt} />
            </button>
          ) : <Poster project={project} />}
        </div>
        <div className="modal__content">
          <p className="eyebrow">DAY {padDay(project.day)} / {project.date}</p>
          <h2 id="project-modal-title">{project.title}</h2>
          <p className="modal__tagline">{project.tagline}</p>
          <p>{project.description}</p>
          <div><h3>What I learned</h3><p>{project.learned}</p></div>
          <div>
            <h3>Pictures</h3>
            <div className="picture-grid">
              {project.images.map((image, index) => (
                <button className="picture-grid__item" key={image.src} type="button" onClick={() => openGallery(index)} aria-label={`View image ${index + 1} full size`}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3>Stack</h3>
            <ul className="tag-list" aria-label="Technology stack">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="modal__actions">
            <a href={project.liveUrl} target="_blank" rel="noreferrer">View Project</a>
            <a href={project.githubUrl} target="_blank" rel="noreferrer">Source</a>
            {project.twitterUrl ? <a href={project.twitterUrl} target="_blank" rel="noreferrer">Twitter</a> : null}
          </div>
        </div>
      </section>
      {galleryImage ? (
        <div className="gallery" role="dialog" aria-modal="true" aria-label="Project image gallery" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setGalleryIndex(null);
        }}>
          <div className="gallery__panel">
            <div className="gallery__toolbar"><span>{galleryIndex! + 1} / {project.images.length}</span><button type="button" onClick={() => setGalleryIndex(null)} aria-label="Close image gallery">Close</button></div>
            <div className="gallery__stage">
              <button type="button" className="gallery__nav" onClick={() => moveGallery(-1)} aria-label="Previous image">←</button>
              <img className="gallery__image" src={galleryImage.src} alt={galleryImage.alt} />
              <button type="button" className="gallery__nav" onClick={() => moveGallery(1)} aria-label="Next image">→</button>
            </div>
            <div className="gallery__thumbs" aria-label="Gallery images">
              {project.images.map((image, index) => <button key={image.src} className={index === galleryIndex ? "is-active" : ""} type="button" onClick={() => openGallery(index)} aria-label={`View image ${index + 1}`} aria-current={index === galleryIndex ? "true" : undefined}><img src={image.src} alt="" /></button>)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
