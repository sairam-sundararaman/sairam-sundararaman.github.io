import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { OrbitalRings } from "./OrbitalRings";

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 15], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#08090a"]} />
      <Suspense fallback={null}>
        <Stars radius={60} depth={30} count={700} factor={2} saturation={0} fade speed={0.35} />
        <OrbitalRings />
      </Suspense>
    </Canvas>
  );
}
