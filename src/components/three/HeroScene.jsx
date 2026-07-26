import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { LossLandscape } from "./LossLandscape";

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 15], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#060810"]} />
      <ambientLight intensity={0.55} color="#8fb3ff" />
      <pointLight position={[6, 6, 8]} intensity={60} color="#ffffff" />
      <pointLight position={[-6, -2, 4]} intensity={40} color="#2fd3d8" />
      <Suspense fallback={null}>
        <Stars radius={60} depth={30} count={1200} factor={2.4} saturation={0} fade speed={0.4} />
        <LossLandscape />
      </Suspense>
    </Canvas>
  );
}
