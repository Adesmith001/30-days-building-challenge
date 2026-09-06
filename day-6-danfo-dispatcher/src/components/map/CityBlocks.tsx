import "@react-three/fiber";

const blocks = [
  [-7, -5, 1.6, 1.2],
  [-4.7, -5.2, 1.4, 1],
  [-2.3, -4.8, 1.2, 1.5],
  [0.1, -4.7, 1.8, 1],
  [-7.1, -2, 1.3, 1.6],
  [-5.3, -1.9, 1, 1],
  [-2.2, -1.8, 1.2, 1.1],
  [0.4, -1.9, 1.5, 1.4],
  [-7, 1.2, 1.3, 1.2],
  [-5, 1.1, 1, 1],
  [-2.4, 2.2, 1.6, 1.3],
  [0, 1.2, 1.4, 1.1],
  [-6.8, 4.5, 1.4, 1],
  [-4.5, 4.7, 1.6, 1.4],
  [-2, 4.5, 1.1, 1.1],
  [0.3, 4.4, 1.5, 1.3],
];

export function CityBlocks() {
  return (
    <group>
      {blocks.map(
        ([x, z, width, depth], index) => (
          <mesh
            key={index}
            position={[
              x,
              0.12 + (index % 3) * 0.025,
              z,
            ]}
            receiveShadow
          >
            <boxGeometry
              args={[
                width,
                0.2 + (index % 3) * 0.05,
                depth,
              ]}
            />

            <meshStandardMaterial
              color={
                index % 2 === 0
                  ? "#e8e3d9"
                  : "#ede9e2"
              }
            />
          </mesh>
        ),
      )}
    </group>
  );
}