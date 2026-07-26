import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A faceted, undulating terrain standing in for a loss landscape —
// the recurring subject of Sairam's own work (Hessian spectra, 2D loss
// surfaces for SGD/momentum, sharpness under quantization). It's the one
// bold visual idea on the page; everything else stays quiet around it.

const WIDTH = 16;
const DEPTH = 10;
const SEG_X = 40;
const SEG_Y = 26;

// Low/high terrain colors as plain floats (avoids allocating THREE.Color
// objects inside the per-frame vertex loop).
const LOW = { r: 0x14 / 255, g: 0x1f / 255, b: 0x52 / 255 };
const HIGH = { r: 0x2f / 255, g: 0xd3 / 255, b: 0xd8 / 255 };

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

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WIDTH, DEPTH, SEG_X, SEG_Y);
    const count = geo.attributes.position.count;
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    // Gentle parallax tilt toward the pointer — cheap, so runs every frame.
    if (groupRef.current) {
      const px = state.pointer.x;
      const py = state.pointer.y;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, px * 0.18, 0.03);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.55 - py * 0.08, 0.03);
    }

    // Vertex displacement runs at ~30fps — visually identical for motion
    // this slow, half the cost for the CPU-side loop below.
    frame.current += 1;
    if (frame.current % 2 !== 0) return;
    clock.current += delta * 2;
    const t = clock.current;

    const posAttr = geometry.attributes.position;
    const colorAttr = geometry.attributes.color;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const h = heightAt(x, y, t);
      posAttr.setZ(i, h);

      const nh = THREE.MathUtils.clamp((h + 2.0) / 4.0, 0, 1);
      const r = LOW.r + (HIGH.r - LOW.r) * nh;
      const g = LOW.g + (HIGH.g - LOW.g) * nh;
      const b = LOW.b + (HIGH.b - LOW.b) * nh;
      colorAttr.setXYZ(i, r, g, b);
    }
    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group ref={groupRef} rotation={[-0.55, 0, 0]} position={[2.1, -1.6, -1]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh geometry={geometry} scale={1.001}>
        <meshBasicMaterial
          color="#2fd3d8"
          wireframe
          transparent
          opacity={0.09}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
        />
      </mesh>
    </group>
  );
}
