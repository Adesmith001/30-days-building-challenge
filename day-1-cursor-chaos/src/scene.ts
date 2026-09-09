import * as THREE from "three";

export function createScene(host: HTMLElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f8f6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1600);
  camera.position.set(0, 0, 900);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 1.9);
  const key = new THREE.DirectionalLight(0xffffff, 1.9);
  key.position.set(-260, 320, 740);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  scene.add(ambient, key);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.075 }),
  );
  floor.position.z = -32;
  floor.receiveShadow = true;
  scene.add(floor);

  return { scene, renderer, camera, floor };
}
