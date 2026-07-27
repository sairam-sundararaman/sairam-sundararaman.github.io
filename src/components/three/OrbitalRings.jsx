import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A quiet armillary-sphere-like construct — a few thin rings on different
// axes, turning slowly at their own pace around a single still point.
// Restrained and a little scientific-instrument-like, rather than a
// literal data visualization — the "classy, not a demo" replacement for
// the earlier landscape mesh.

const RING_RADIUS = 3.1;
const TUBE_RADIUS = 0.014;

const RINGS = [
  { rotation: [0, 0, 0], axis: "y", speed: 0.055 },
  { rotation: [Math.PI / 3.1, Math.PI / 5, 0], axis: "x", speed: -0.04 },
  { rotation: [-Math.PI / 4, Math.PI / 2.3, Math.PI / 6], axis: "z", speed: 0.032 },
];

function Ring({ rotation, axis, speed }) {
  const ref = useRef(null);
  const geometry = useMemo(() => new THREE.TorusGeometry(RING_RADIUS, TUBE_RADIUS, 10, 128), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation[axis] += speed * delta;
  });

  return (
    <group rotation={rotation}>
      <mesh ref={ref} geometry={geometry}>
        <meshBasicMaterial color="#8b93a3" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export function OrbitalRings() {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, px * 0.15, 0.025);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.2 - py * 0.1, 0.025);
  });

  return (
    <group ref={groupRef} rotation={[-0.2, 0, 0]} position={[0, 0, -2]}>
      {RINGS.map((r, i) => (
        <Ring key={i} {...r} />
      ))}
      <mesh>
        <sphereGeometry args={[0.05, 24, 24]} />
        <meshBasicMaterial color="#2fd3d8" />
      </mesh>
    </group>
  );
}
