import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A quiet wireframe terrain, standing in for a loss landscape — the
// recurring subject of Sairam's own work (Hessian spectra, 2D loss
// surfaces for SGD/momentum, sharpness under quantization). Line art only,
// no solid shading or lights needed — closer to a technical diagram than
// a product-render centerpiece.

const WIDTH = 20;
const DEPTH = 13;
const SEG_X = 34;
const SEG_Y = 22;

function heightAt(x, y, t) {
  return (
    Math.sin(x * 0.34 + t * 0.15) * 0.85 +
    Math.cos(y * 0.46 - t * 0.11) * 0.65 +
    Math.sin((x + y) * 0.22 + t * 0.07) * 0.5
  );
}

export function LossLandscape() {
  const groupRef = useRef(null);
  const clock = useRef(0);
  const frame = useRef(0);

  const geometry = useMemo(() => new THREE.PlaneGeometry(WIDTH, DEPTH, SEG_X, SEG_Y), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const px = state.pointer.x;
      const py = state.pointer.y;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, px * 0.12, 0.025);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.6 - py * 0.05, 0.025);
    }

    frame.current += 1;
    if (frame.current % 2 !== 0) return;
    clock.current += delta * 2;
    const t = clock.current;

    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      posAttr.setZ(i, heightAt(posAttr.getX(i), posAttr.getY(i), t));
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef} rotation={[-0.6, 0, 0]} position={[0, -0.4, -2]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#2fd3d8" wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  );
}
