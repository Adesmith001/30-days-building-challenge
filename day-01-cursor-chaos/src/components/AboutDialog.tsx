export function AboutDialog({ onClose }: { onClose: () => void }) {
  return (
    <section
      className="about"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="about-panel">
        <button type="button" className="close" onClick={onClose} aria-label="Close">X</button>
        <p>DAY 01 / 30</p>
        <h2 id="about-title">Cursor Chaos</h2>
        <p>Your cursor has gravity. Drop objects in, let them collide, then change gravity, wind, or zero-G.</p>
        <dl>
          <div><dt>CANVAS</dt><dd>Three.js</dd></div>
          <div><dt>PHYSICS</dt><dd>Matter.js</dd></div>
          <div><dt>SHORTCUTS</dt><dd>G gravity, W wind, Z zero-G, P pulse, R reset, D debug, Space spawn</dd></div>
        </dl>
      </div>
    </section>
  );
}
