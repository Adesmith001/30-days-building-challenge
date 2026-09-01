import Matter from "matter-js";
import * as THREE from "three";
import { pick, random } from "./random";
import type { ChaosObject, ChaosShape, MassClass } from "./types";

function material(index: number) {
  const color = index % 5 === 0 ? 0xf8f8f4 : index % 3 === 0 ? 0x60625f : 0x050505;
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.86,
    metalness: 0,
    side: THREE.DoubleSide,
  });
}

function geometry(shape: ChaosShape, width: number, height: number) {
  if (shape === "circle") return new THREE.SphereGeometry(width / 2, 16, 10);
  if (shape === "ring") return new THREE.TorusGeometry(width / 2, 5, 8, 18);
  if (shape === "triangle") {
    const triangle = new THREE.Shape();
    triangle.moveTo(0, -height / 2);
    triangle.lineTo(width / 2, height / 2);
    triangle.lineTo(-width / 2, height / 2);
    triangle.lineTo(0, -height / 2);
    return new THREE.ExtrudeGeometry(triangle, { depth: 14, bevelEnabled: false });
  }
  return new THREE.BoxGeometry(width, height, shape === "bar" ? 14 : 24);
}

function bodyFor(shape: ChaosShape, x: number, y: number, width: number, height: number, base: number, mass: MassClass) {
  const options: Matter.IBodyDefinition = {
    restitution: 0.36,
    friction: 0.72,
    frictionAir: mass === "heavy" ? 0.018 : 0.026,
    density: mass === "heavy" ? 0.0036 : mass === "medium" ? 0.0022 : 0.0014,
    angle: random(-0.45, 0.45),
  };

  if (shape === "circle" || shape === "ring") return Matter.Bodies.circle(x, y, base / 2, options);
  if (shape === "triangle") return Matter.Bodies.polygon(x, y, 3, base / 1.65, options);
  return Matter.Bodies.rectangle(x, y, width, height, options);
}

export function createObject(world: Matter.World, scene: THREE.Scene, areaWidth: number, x?: number, y?: number, index = 0): ChaosObject {
  const shape = pick<ChaosShape>(["circle", "box", "bar", "triangle", "ring"]);
  const massClass = pick<MassClass>(["light", "light", "medium", "medium", "heavy"]);
  const base = massClass === "heavy" ? random(52, 72) : massClass === "medium" ? random(34, 52) : random(22, 36);
  const bodyWidth = shape === "bar" ? base * random(1.7, 2.35) : base;
  const bodyHeight = shape === "bar" ? base * random(0.35, 0.6) : shape === "triangle" ? base * 1.05 : base;
  const body = bodyFor(
    shape,
    x ?? random(70, areaWidth - 70),
    y ?? random(-170, 80),
    bodyWidth,
    bodyHeight,
    base,
    massClass,
  );
  const mesh = new THREE.Mesh(geometry(shape, bodyWidth, bodyHeight), material(index));

  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.rotation.x = random(-0.1, 0.1);
  mesh.rotation.y = random(-0.1, 0.1);
  Matter.Composite.add(world, body);
  scene.add(mesh);

  return { body, mesh, shape, massClass };
}

export function disposeObject(world: Matter.World, scene: THREE.Scene, item: ChaosObject) {
  Matter.Composite.remove(world, item.body);
  scene.remove(item.mesh);
  item.mesh.geometry.dispose();
}
