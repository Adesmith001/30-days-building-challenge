import Matter from "matter-js";
import { createObject, disposeObject } from "./objects";
import { random } from "./random";
import { createScene } from "./scene";
import { renderWorldText } from "./textState";
import { INITIAL_DESKTOP, INITIAL_MOBILE, MAX_OBJECTS } from "./constants";
import { applyCursorForces, applyEnvironment, applyGrab, containObjects, syncMeshes } from "./simulation";
import { canvasPointerPosition, isMobileSize, makePointer, rebuildWalls } from "./worldHelpers";
import type { ChaosObject, WorldOptions, WorldStats } from "./types";

export class ChaosWorld {
  private engine = Matter.Engine.create({ enableSleeping: false });
  private sceneKit: ReturnType<typeof createScene>;
  private objects: ChaosObject[] = [];
  private walls: Matter.Body[] = [];
  private pointer = makePointer();
  private width = 1;
  private height = 1;
  private last = performance.now();
  private raf = 0;
  private fps = 60;
  private statsTimer = 0;

  constructor(
    private host: HTMLElement,
    private options: WorldOptions,
    private onStats: (stats: WorldStats) => void,
  ) {
    this.sceneKit = createScene(host);
    this.bind();
    this.resize();
    this.reset();
    this.statsTimer = window.setInterval(() => this.report(), 500);
    this.raf = requestAnimationFrame((now) => this.loop(now));
  }

  setOptions(options: WorldOptions) {
    this.options = options;
  }

  api() {
    return { reset: () => this.reset(), spawn: () => this.spawn() };
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearInterval(this.statsTimer);
    this.unbind();
    delete window.advanceTime;
    delete window.render_game_to_text;
    Matter.Engine.clear(this.engine);
    this.sceneKit.renderer.dispose();
    this.host.removeChild(this.sceneKit.renderer.domElement);
  }

  private bind() {
    const canvas = this.sceneKit.renderer.domElement;
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("resize", this.resize);
    window.advanceTime = (ms) => this.step(ms);
    window.render_game_to_text = () => renderWorldText({ options: this.options, fps: this.fps, objects: this.objects, pointer: this.pointer });
  }

  private unbind() {
    const canvas = this.sceneKit.renderer.domElement;
    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("resize", this.resize);
  }

  private resize = () => {
    this.width = Math.max(320, this.host.clientWidth || window.innerWidth);
    this.height = Math.max(460, this.host.clientHeight || window.innerHeight);
    const { renderer, camera, floor } = this.sceneKit;
    renderer.setSize(this.width, this.height, false);
    camera.left = -this.width / 2;
    camera.right = this.width / 2;
    camera.top = this.height / 2;
    camera.bottom = -this.height / 2;
    camera.updateProjectionMatrix();
    floor.scale.set(this.width * 1.15, this.height * 1.15, 1);
    this.walls = rebuildWalls(this.engine.world, this.walls, this.width, this.height);
  };

  private reset() {
    for (const item of this.objects) disposeObject(this.engine.world, this.sceneKit.scene, item);
    this.objects = [];
    const count = isMobileSize() ? INITIAL_MOBILE : INITIAL_DESKTOP;
    for (let i = 0; i < count; i += 1) this.spawn(random(60, this.width - 60), random(-150, 80));
    this.report();
  }

  private spawn(x = this.pointer.x, y = this.pointer.y) {
    if (this.objects.length >= MAX_OBJECTS) return;
    this.objects.push(createObject(this.engine.world, this.sceneKit.scene, this.width, x, y, this.objects.length));
    this.report();
  }

  private step(ms: number) {
    applyEnvironment(this.engine, this.options);
    applyGrab(this.pointer);
    applyCursorForces(this.objects, this.pointer, this.options);
    let remaining = Math.min(33, ms);
    while (remaining > 0) {
      const slice = Math.min(1000 / 60, remaining);
      Matter.Engine.update(this.engine, slice);
      remaining -= slice;
    }
    containObjects(this.objects, this.width, this.height);
    syncMeshes(this.objects, this.width, this.height);
    this.sceneKit.renderer.render(this.sceneKit.scene, this.sceneKit.camera);
  }

  private loop(now: number) {
    const elapsed = Math.min(40, now - this.last);
    this.last = now;
    this.fps = this.fps * 0.94 + (1000 / Math.max(1, elapsed)) * 0.06;
    this.step(elapsed);
    this.raf = requestAnimationFrame((next) => this.loop(next));
  }

  private report() {
    this.onStats({ fps: Math.round(this.fps), objects: this.objects.length });
  }

  private onPointerMove = (event: PointerEvent) => {
    const pos = canvasPointerPosition(this.sceneKit.renderer.domElement, this.width, this.height, event);
    this.pointer.prevX = this.pointer.x;
    this.pointer.prevY = this.pointer.y;
    this.pointer.x = pos.x;
    this.pointer.y = pos.y;
    this.pointer.vx = this.pointer.x - this.pointer.prevX;
    this.pointer.vy = this.pointer.y - this.pointer.prevY;
    this.pointer.active = true;
  };

  private onPointerDown = (event: PointerEvent) => {
    this.sceneKit.renderer.domElement.setPointerCapture(event.pointerId);
    this.onPointerMove(event);
    this.pointer.down = true;
    const hit = Matter.Query.point(this.objects.map((item) => item.body), { x: this.pointer.x, y: this.pointer.y })[0];
    if (hit) {
      this.pointer.grabBody = hit;
      this.pointer.grabOffsetX = hit.position.x - this.pointer.x;
      this.pointer.grabOffsetY = hit.position.y - this.pointer.y;
    } else if (event.detail > 1) {
      this.spawn(this.pointer.x, this.pointer.y);
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    if (this.pointer.grabBody) Matter.Body.setVelocity(this.pointer.grabBody, { x: this.pointer.vx * 0.32, y: this.pointer.vy * 0.32 });
    this.sceneKit.renderer.domElement.releasePointerCapture(event.pointerId);
    this.pointer.down = false;
    this.pointer.grabBody = null;
  };
}
