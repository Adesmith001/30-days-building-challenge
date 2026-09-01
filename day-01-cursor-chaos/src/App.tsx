import { useCallback, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import * as THREE from "three";
import {
  clamp,
  computeCursorForce,
  cycleGravity,
  cycleTimeScale,
  gravityLabel,
  gravityVector,
  type CursorMode,
  type GravityState,
  type TimeScale,
} from "./physics";

declare global {
  interface Window {
    advanceTime?: (ms: number) => void;
    render_game_to_text?: () => string;
  }
}

type ChaosShape = "circle" | "box" | "bar" | "triangle" | "ring";
type ChaosObject = {
  body: Matter.Body;
  mesh: THREE.Mesh;
  shape: ChaosShape;
  massClass: "light" | "medium" | "heavy";
};
type PointerState = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  active: boolean;
  moved: boolean;
  down: boolean;
  grabBody: Matter.Body | null;
  grabOffsetX: number;
  grabOffsetY: number;
  downAt: number;
};

const MAX_OBJECTS = 100;
const INITIAL_DESKTOP = 42;
const INITIAL_MOBILE = 26;
const modes: CursorMode[] = ["stir", "attract", "repel", "vortex"];

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function isMobileSize() {
  return window.innerWidth < 760;
}

function makeMaterial(kind: number) {
  if (kind % 5 === 0) {
    return new THREE.MeshStandardMaterial({
      color: 0xf8f8f4,
      roughness: 0.72,
      metalness: 0,
      side: THREE.DoubleSide,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: kind % 3 === 0 ? 0x585a57 : 0x050505,
    roughness: 0.86,
    metalness: 0,
    side: THREE.DoubleSide,
  });
}

function makeGeometry(shape: ChaosShape, width: number, height: number) {
  if (shape === "circle") return new THREE.SphereGeometry(width / 2, 24, 16);
  if (shape === "triangle") {
    const triangle = new THREE.Shape();
    triangle.moveTo(0, -height / 2);
    triangle.lineTo(width / 2, height / 2);
    triangle.lineTo(-width / 2, height / 2);
    triangle.lineTo(0, -height / 2);
    return new THREE.ExtrudeGeometry(triangle, { depth: 18, bevelEnabled: false });
  }
  if (shape === "ring") return new THREE.TorusGeometry(width / 2, 5, 10, 28);
  return new THREE.BoxGeometry(width, height, shape === "bar" ? 18 : 28);
}

function createObject(
  world: Matter.World,
  scene: THREE.Scene,
  width: number,
  x = random(80, width - 80),
  y = random(-420, -30),
  index = 0,
): ChaosObject {
  const shapes: ChaosShape[] = ["circle", "box", "bar", "triangle", "ring"];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const massClass = Math.random() > 0.78 ? "heavy" : Math.random() > 0.48 ? "medium" : "light";
  const base = massClass === "heavy" ? random(58, 88) : massClass === "medium" ? random(36, 58) : random(24, 42);
  const bodyWidth = shape === "bar" ? base * random(1.8, 2.7) : base;
  const bodyHeight = shape === "bar" ? base * random(0.36, 0.65) : shape === "triangle" ? base * 1.08 : base;
  const options: Matter.IBodyDefinition = {
    restitution: random(0.22, 0.62),
    friction: 0.68,
    frictionAir: massClass === "heavy" ? 0.012 : 0.018,
    density: massClass === "heavy" ? 0.004 : massClass === "medium" ? 0.0024 : 0.0014,
    angle: random(-0.7, 0.7),
  };
  const body =
    shape === "circle" || shape === "ring"
      ? Matter.Bodies.circle(x, y, base / 2, options)
      : shape === "triangle"
        ? Matter.Bodies.polygon(x, y, 3, base / 1.6, options)
        : Matter.Bodies.rectangle(x, y, bodyWidth, bodyHeight, options);
  const mesh = new THREE.Mesh(makeGeometry(shape, bodyWidth, bodyHeight), makeMaterial(index));

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.rotation.x = random(-0.16, 0.16);
  mesh.rotation.y = random(-0.14, 0.14);

  Matter.Composite.add(world, body);
  scene.add(mesh);

  return { body, mesh, shape, massClass };
}

function AppCanvas({
  mode,
  gravity,
  timeScale,
  debug,
  clean,
  onStats,
  onReady,
}: {
  mode: CursorMode;
  gravity: GravityState;
  timeScale: TimeScale;
  debug: boolean;
  clean: boolean;
  onStats: (stats: { fps: number; objects: number }) => void;
  onReady: (api: { reset: () => void; spawn: () => void; shake: () => void }) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const refs = useRef({ mode, gravity, timeScale, debug, clean });

  useEffect(() => {
    refs.current = { mode, gravity, timeScale, debug, clean };
  }, [mode, gravity, timeScale, debug, clean]);

  useEffect(() => {
    const currentHost = hostRef.current;
    if (!currentHost) return;
    const host = currentHost;

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1600);
    camera.position.set(0, 0, 900);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 1.75);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-260, 320, 740);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(ambient, key);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.09 }),
    );
    floor.position.z = -36;
    floor.receiveShadow = true;
    scene.add(floor);

    const objects: ChaosObject[] = [];
    const walls: Matter.Body[] = [];
    const pointer: PointerState = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      prevX: window.innerWidth / 2,
      prevY: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      active: false,
      moved: false,
      down: false,
      grabBody: null,
      grabOffsetX: 0,
      grabOffsetY: 0,
      downAt: 0,
    };

    let width = 1;
    let height = 1;
    let last = performance.now();
    let raf = 0;
    let fps = 60;
    let shakeFrames = 0;
    let vortexHold = 0;

    function syncGravity() {
      const vector = gravityVector(refs.current.gravity);
      engine.gravity.x = vector.x;
      engine.gravity.y = vector.y;
      engine.gravity.scale = refs.current.gravity === "off" ? 0 : 0.00105;
    }

    function rebuildWalls() {
      Matter.Composite.remove(world, walls);
      walls.length = 0;
      const wallSize = 100;
      walls.push(
        Matter.Bodies.rectangle(width / 2, height + wallSize / 2, width + wallSize * 2, wallSize, { isStatic: true }),
        Matter.Bodies.rectangle(width / 2, -wallSize / 2, width + wallSize * 2, wallSize, { isStatic: true }),
        Matter.Bodies.rectangle(-wallSize / 2, height / 2, wallSize, height + wallSize * 2, { isStatic: true }),
        Matter.Bodies.rectangle(width + wallSize / 2, height / 2, wallSize, height + wallSize * 2, { isStatic: true }),
      );
      Matter.Composite.add(world, walls);
    }

    function resize() {
      width = Math.max(320, host.clientWidth || window.innerWidth);
      height = Math.max(460, host.clientHeight || window.innerHeight);
      renderer.setSize(width, height, false);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      floor.scale.set(width * 1.15, height * 1.15, 1);
      rebuildWalls();
      for (const item of objects) {
        Matter.Body.setPosition(item.body, {
          x: clamp(item.body.position.x, 24, width - 24),
          y: clamp(item.body.position.y, -height * 0.5, height - 24),
        });
      }
    }

    function spawnAt(x = random(80, width - 80), y = random(-200, 80)) {
      if (objects.length >= MAX_OBJECTS) return;
      objects.push(createObject(world, scene, width, x, y, objects.length));
      onStats({ fps: Math.round(fps), objects: objects.length });
    }

    function reset() {
      for (const item of objects) {
        Matter.Composite.remove(world, item.body);
        scene.remove(item.mesh);
        item.mesh.geometry.dispose();
      }
      objects.length = 0;
      const count = isMobileSize() ? INITIAL_MOBILE : INITIAL_DESKTOP;
      for (let i = 0; i < count; i += 1) spawnAt(random(70, width - 70), random(-360, 160));
      pointer.moved = false;
    }

    function shake() {
      shakeFrames = 18;
      for (const item of objects) {
        Matter.Body.applyForce(item.body, item.body.position, {
          x: random(-0.08, 0.08) / item.body.mass,
          y: random(-0.12, 0.04) / item.body.mass,
        });
      }
    }

    function bodyAt(x: number, y: number) {
      return Matter.Query.point(
        objects.map((item) => item.body),
        { x, y },
      )[0] ?? null;
    }

    function applyPointerForces(dt: number) {
      if (!pointer.active) return;
      const radius = refs.current.mode === "stir" ? 120 : 190;
      for (const item of objects) {
        if (item.body === pointer.grabBody) continue;
        const dx = item.body.position.x - pointer.x;
        const dy = item.body.position.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > radius || distance < 0.01) continue;
        const proximity = 1 - distance / radius;

        if (refs.current.mode === "stir") {
          const force = computeCursorForce({
            bodyPosition: item.body.position,
            cursorPosition: pointer,
            cursorVelocity: pointer,
            radius,
            mass: item.body.mass,
            strength: 0.00011,
          });
          Matter.Body.applyForce(item.body, item.body.position, force);
        } else {
          const direction = refs.current.mode === "repel" ? 1 : -1;
          const pull = refs.current.mode === "vortex" ? -1 : direction;
          const base = (0.00008 + proximity * 0.00034) * dt * 60;
          Matter.Body.applyForce(item.body, item.body.position, {
            x: (dx / distance) * base * pull,
            y: (dy / distance) * base * pull,
          });
          if (refs.current.mode === "vortex") {
            Matter.Body.applyForce(item.body, item.body.position, {
              x: (-dy / distance) * base * 1.28,
              y: (dx / distance) * base * 1.28,
            });
          }
        }
      }

      if (refs.current.mode === "vortex" && pointer.down) {
        vortexHold += dt;
        if (vortexHold > 3 && objects.length > 10) {
          shake();
          for (const item of objects) {
            Matter.Body.applyForce(item.body, item.body.position, {
              x: random(-0.16, 0.16) / item.body.mass,
              y: random(-0.16, 0.16) / item.body.mass,
            });
          }
          vortexHold = 0;
        }
      } else {
        vortexHold = 0;
      }
    }

    function syncMeshes() {
      for (const item of objects) {
        item.mesh.position.set(item.body.position.x - width / 2, height / 2 - item.body.position.y, 0);
        item.mesh.rotation.z = -item.body.angle;
        item.mesh.rotation.x += item.body.angularVelocity * 0.012;
        item.mesh.rotation.y += item.body.velocity.x * 0.0009;
      }
    }

    function step(ms: number) {
      const scaled = ms * refs.current.timeScale;
      const dt = Math.min(1 / 20, scaled / 1000);
      syncGravity();

      if (pointer.grabBody) {
        Matter.Body.setPosition(pointer.grabBody, {
          x: pointer.x + pointer.grabOffsetX,
          y: pointer.y + pointer.grabOffsetY,
        });
        Matter.Body.setVelocity(pointer.grabBody, { x: pointer.vx * 0.16, y: pointer.vy * 0.16 });
      }

      applyPointerForces(dt);

      if (shakeFrames > 0) {
        shakeFrames -= 1;
        camera.position.x = random(-5, 5);
        camera.position.y = random(-5, 5);
      } else {
        camera.position.x *= 0.75;
        camera.position.y *= 0.75;
      }

      let remaining = scaled;
      while (remaining > 0) {
        const slice = Math.min(1000 / 60, remaining);
        Matter.Engine.update(engine, slice);
        remaining -= slice;
      }
      for (const item of objects) {
        const margin = 180;
        if (
          item.body.position.x < -margin ||
          item.body.position.x > width + margin ||
          item.body.position.y < -height ||
          item.body.position.y > height + margin
        ) {
          Matter.Body.setPosition(item.body, {
            x: clamp(item.body.position.x, 40, width - 40),
            y: clamp(item.body.position.y, 40, height - 40),
          });
          Matter.Body.setVelocity(item.body, {
            x: clamp(item.body.velocity.x * -0.35, -12, 12),
            y: clamp(item.body.velocity.y * -0.35, -12, 12),
          });
        }
      }
      syncMeshes();
      renderer.render(scene, camera);
    }

    function loop(now: number) {
      const elapsed = Math.min(48, now - last);
      last = now;
      fps = fps * 0.92 + (1000 / Math.max(1, elapsed)) * 0.08;
      step(elapsed);
      raf = requestAnimationFrame(loop);
    }

    function pointerPosition(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: clamp(event.clientX - rect.left, 0, width),
        y: clamp(event.clientY - rect.top, 0, height),
      };
    }

    function onPointerMove(event: PointerEvent) {
      const pos = pointerPosition(event);
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = pos.x;
      pointer.y = pos.y;
      pointer.vx = pointer.x - pointer.prevX;
      pointer.vy = pointer.y - pointer.prevY;
      pointer.active = true;
      pointer.moved = true;
    }

    function onPointerDown(event: PointerEvent) {
      renderer.domElement.setPointerCapture(event.pointerId);
      onPointerMove(event);
      pointer.down = true;
      pointer.downAt = performance.now();
      const hit = bodyAt(pointer.x, pointer.y);
      if (hit) {
        pointer.grabBody = hit;
        pointer.grabOffsetX = hit.position.x - pointer.x;
        pointer.grabOffsetY = hit.position.y - pointer.y;
      } else if (event.detail > 1) {
        spawnAt(pointer.x, pointer.y);
      }
    }

    function onPointerUp(event: PointerEvent) {
      if (pointer.grabBody) {
        Matter.Body.setVelocity(pointer.grabBody, { x: pointer.vx * 0.55, y: pointer.vy * 0.55 });
      } else if (refs.current.mode === "repel") {
        for (const item of objects) {
          const dx = item.body.position.x - pointer.x;
          const dy = item.body.position.y - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance < 280) {
            Matter.Body.applyForce(item.body, item.body.position, {
              x: (dx / distance) * 0.075,
              y: (dy / distance) * 0.075,
            });
          }
        }
      }
      renderer.domElement.releasePointerCapture(event.pointerId);
      pointer.down = false;
      pointer.grabBody = null;
    }

    function renderText() {
      return JSON.stringify({
        coordinateSystem: "origin top-left, x right, y down",
        mode: refs.current.mode,
        gravity: refs.current.gravity,
        timeScale: refs.current.timeScale,
        fps: Math.round(fps),
        objects: objects.length,
        pointer: {
          x: Math.round(pointer.x),
          y: Math.round(pointer.y),
          vx: Math.round(pointer.vx),
          vy: Math.round(pointer.vy),
          active: pointer.active,
          grabbing: Boolean(pointer.grabBody),
        },
        visibleBodies: objects.slice(0, 12).map((item) => ({
          shape: item.shape,
          mass: item.massClass,
          x: Math.round(item.body.position.x),
          y: Math.round(item.body.position.y),
          vx: Number(item.body.velocity.x.toFixed(2)),
          vy: Number(item.body.velocity.y.toFixed(2)),
        })),
      });
    }

    function updateStats() {
      onStats({ fps: Math.round(fps), objects: objects.length });
    }

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", resize);
    window.advanceTime = step;
    window.render_game_to_text = renderText;

    resize();
    reset();
    onReady({ reset, spawn: () => spawnAt(pointer.x, pointer.y), shake });
    const statsTimer = window.setInterval(updateStats, 500);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(statsTimer);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", resize);
      delete window.advanceTime;
      delete window.render_game_to_text;
      Matter.Engine.clear(engine);
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [onReady, onStats]);

  return <div ref={hostRef} className="canvas-host" aria-label="Cursor Chaos physics canvas" />;
}

function App() {
  const [mode, setMode] = useState<CursorMode>("stir");
  const [gravity, setGravity] = useState<GravityState>("down");
  const [timeScale, setTimeScale] = useState<TimeScale>(1);
  const [debug, setDebug] = useState(false);
  const [clean, setClean] = useState(false);
  const [about, setAbout] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [stats, setStats] = useState({ fps: 60, objects: 0 });
  const api = useRef({ reset: () => {}, spawn: () => {}, shake: () => {} });
  const handleStats = useCallback((nextStats: { fps: number; objects: number }) => {
    setStats(nextStats);
  }, []);
  const handleReady = useCallback((nextApi: { reset: () => void; spawn: () => void; shake: () => void }) => {
    api.current = nextApi;
  }, []);

  useEffect(() => {
    const onMove = () => setIntroHidden(true);
    window.addEventListener("pointermove", onMove, { once: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") setMode("stir");
      if (event.key === "2") setMode("attract");
      if (event.key === "3") setMode("repel");
      if (event.key === "4") setMode("vortex");
      if (event.key.toLowerCase() === "g") setGravity((value) => cycleGravity(value));
      if (event.key.toLowerCase() === "t") setTimeScale((value) => cycleTimeScale(value));
      if (event.key.toLowerCase() === "s") api.current.shake();
      if (event.key.toLowerCase() === "r") api.current.reset();
      if (event.key.toLowerCase() === "d") setDebug((value) => !value);
      if (event.code === "Space") {
        event.preventDefault();
        api.current.spawn();
      }
      if (event.key === "Escape") {
        setClean(false);
        setAbout(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className={`app ${clean ? "is-clean" : ""}`}>
      <AppCanvas
        mode={mode}
        gravity={gravity}
        timeScale={timeScale}
        debug={debug}
        clean={clean}
        onStats={handleStats}
        onReady={handleReady}
      />

      <header className="topbar">
        <div className="day">DAY 01/30</div>
        <h1>CURSOR_CHAOS</h1>
        <nav>
          <button type="button" onClick={() => api.current.reset()}>RESET</button>
          <button type="button" onClick={() => setAbout(true)}>ABOUT</button>
          <a href="https://github.com/Adesmith001" target="_blank" rel="noreferrer">GITHUB</a>
        </nav>
      </header>

      <section className={`intro ${introHidden ? "is-hidden" : ""}`} aria-live="polite">
        <h2>MOVE YOUR CURSOR</h2>
        <p>The world will notice.</p>
      </section>

      <aside className="rail" aria-label="Controls">
        <span>CONTROLS</span>
        {modes.map((item, index) => (
          <button
            key={item}
            className={mode === item ? "active" : ""}
            type="button"
            onClick={() => setMode(item)}
            title={`${index + 1}: ${item}`}
            aria-label={item}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" onClick={() => api.current.spawn()} title="Spawn object">+</button>
      </aside>

      <div className="bottombar">
        <div className="mode-row" role="group" aria-label="Cursor modes">
          {modes.map((item) => (
            <button
              key={item}
              className={mode === item ? "active" : ""}
              type="button"
              onClick={() => setMode(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="utility-row">
          <button type="button" onClick={() => setGravity((value) => cycleGravity(value))}>
            GRAVITY: {gravityLabel(gravity)}
          </button>
          <button type="button" onClick={() => setTimeScale((value) => cycleTimeScale(value))}>
            TIME: {timeScale}X
          </button>
          <button type="button" onClick={() => api.current.spawn()} disabled={stats.objects >= MAX_OBJECTS}>
            + OBJECT
          </button>
          <button type="button" onClick={() => api.current.shake()}>SHAKE</button>
          <button type="button" onClick={() => setClean(true)}>CLEAN</button>
        </div>
      </div>

      {debug && (
        <div className="debug-hud">
          <span>OBJECTS {stats.objects}</span>
          <span>FPS {stats.fps}</span>
          <span>GRAVITY {gravityLabel(gravity)}</span>
          <span>MODE {mode.toUpperCase()}</span>
        </div>
      )}

      <footer className="status-line">
        <span>STABLE_BUILD</span>
        <span>SYSTEM_LOG</span>
        <span>FPS: {stats.fps} | ENTITIES: {stats.objects}</span>
      </footer>

      {about && (
        <section
          className="about"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAbout(false);
          }}
        >
          <div className="about-panel">
            <button type="button" className="close" onClick={() => setAbout(false)} aria-label="Close">X</button>
            <p>DAY 01 / 30</p>
            <h2 id="about-title">CURSOR CHAOS</h2>
            <p>A tiny physics world where your cursor becomes part of the simulation.</p>
            <dl>
              <div><dt>RENDERING</dt><dd>Three.js</dd></div>
              <div><dt>PHYSICS</dt><dd>Matter.js</dd></div>
              <div><dt>INTERFACE</dt><dd>React + TypeScript</dd></div>
              <div><dt>SHORTCUTS</dt><dd>1-4 modes, G gravity, T time, S shake, R reset, D debug, Space spawn</dd></div>
            </dl>
          </div>
        </section>
      )}
    </main>
  );
}

export { App };
