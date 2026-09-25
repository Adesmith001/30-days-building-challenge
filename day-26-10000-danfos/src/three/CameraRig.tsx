import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { useSimulationStore } from "../store/useSimulationStore";

const targets = {
  city: {
    position: new THREE.Vector3(330, 340, 330),
    target: new THREE.Vector3(0, 0, 0),
  },
  top: {
    position: new THREE.Vector3(0, 560, 0.1),
    target: new THREE.Vector3(0, 0, 0),
  },
  junction: {
    position: new THREE.Vector3(120, 130, 120),
    target: new THREE.Vector3(0, 0, 0),
  },
  close: {
    position: new THREE.Vector3(65, 45, 60),
    target: new THREE.Vector3(0, 0, 0),
  },
};

export function CameraRig() {
  const { camera } = useThree();

  const preset = useSimulationStore(
    (state) => state.cameraPreset,
  );

  const desired = useMemo(
    () => targets[preset],
    [preset],
  );

  useFrame(() => {
    camera.position.lerp(
      desired.position,
      0.035,
    );

    camera.lookAt(desired.target);
  });

  return (
    <OrbitControls
      enablePan
      enableZoom
      enableRotate
      minDistance={35}
      maxDistance={720}
      maxPolarAngle={Math.PI / 2.04}
      minPolarAngle={0.05}
      target={[0, 0, 0]}
      dampingFactor={0.07}
      enableDamping
    />
  );
}
