"use client";

import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Theme } from "@/lib/theme";

type Tone = "white" | "mist" | "dark" | "glass";

type Panel = {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  tone: Tone;
  speed: number;
};

/** Panels orbit an empty core so the hero wordmark sits inside the composition. */
const PANELS: Panel[] = [
  { position: [-4.5, 1.45, -1.2], rotation: [0.16, 0.52, -0.12], size: [2.7, 1.8, 0.1], tone: "white", speed: 1.1 },
  { position: [4.55, 1.95, -2.4], rotation: [-0.2, -0.46, 0.1], size: [2.2, 1.45, 0.1], tone: "mist", speed: 0.85 },
  { position: [4.0, -1.75, 0.6], rotation: [0.12, -0.34, -0.08], size: [3.0, 2.0, 0.12], tone: "white", speed: 1.35 },
  { position: [-4.1, -2.0, 1.1], rotation: [-0.13, 0.4, 0.15], size: [2.0, 1.32, 0.1], tone: "dark", speed: 0.95 },
  { position: [-2.3, 2.85, -3.2], rotation: [0.32, 0.22, 0.2], size: [1.5, 1.5, 0.1], tone: "glass", speed: 1.5 },
  { position: [2.5, -3.0, -2.6], rotation: [-0.26, -0.22, -0.16], size: [1.7, 1.1, 0.1], tone: "glass", speed: 1.2 },
];

/**
 * Dark is not a filter over the light scene: the near-black panel becomes the
 * bright one, and the matte sphere becomes chrome, so contrast survives.
 */
const PALETTES = {
  light: {
    white: { color: "#ffffff", roughness: 0.26, metalness: 0.06 },
    mist: { color: "#dededf", roughness: 0.42, metalness: 0.12 },
    dark: { color: "#0d0d0f", roughness: 0.34, metalness: 0.42 },
    glass: { color: "#d5d5da", roughness: 0.06, metalness: 0.28, opacity: 0.5 },
    sphere: { color: "#111114", roughness: 0.12, metalness: 0.9 },
    cube: { color: "#0d0d0f", roughness: 0.3, metalness: 0.5 },
    ring: { color: "#0a0a0b", opacity: 0.13 },
    env: "#f1f1f2",
    ambient: 0.35,
    key: 1.15,
    formers: [3, 1.7, 2.4],
  },
  dark: {
    white: { color: "#25252c", roughness: 0.3, metalness: 0.38 },
    mist: { color: "#1b1b21", roughness: 0.45, metalness: 0.3 },
    dark: { color: "#e9e9ef", roughness: 0.3, metalness: 0.2 },
    glass: { color: "#3b3b46", roughness: 0.05, metalness: 0.5, opacity: 0.55 },
    sphere: { color: "#f0f0f4", roughness: 0.08, metalness: 0.95 },
    cube: { color: "#e9e9ef", roughness: 0.25, metalness: 0.3 },
    ring: { color: "#ffffff", opacity: 0.16 },
    env: "#1a1a1f",
    ambient: 0.22,
    key: 0.9,
    formers: [2.4, 1.3, 2],
  },
} as const;

type Palette = (typeof PALETTES)[Theme];

function ToneMaterial({ tone, palette }: { tone: Tone; palette: Palette }) {
  if (tone === "glass") {
    const glass = palette.glass;
    return (
      <meshPhysicalMaterial
        color={glass.color}
        roughness={glass.roughness}
        metalness={glass.metalness}
        transparent
        opacity={glass.opacity}
        clearcoat={1}
      />
    );
  }

  const material = palette[tone];
  return (
    <meshStandardMaterial
      color={material.color}
      roughness={material.roughness}
      metalness={material.metalness}
    />
  );
}

function Composition({ still, palette }: { still: boolean; palette: Palette }) {
  const group = useRef<THREE.Group>(null);
  const aspect = useThree((state) => state.viewport.aspect);
  const scale = THREE.MathUtils.clamp(aspect * 0.74, 0.52, 1);

  useFrame((state, delta) => {
    if (!group.current || still) return;
    const { pointer, clock } = state;
    const targetY = pointer.x * 0.16 + Math.sin(clock.elapsedTime * 0.12) * 0.04;
    const targetX = -pointer.y * 0.1 + Math.cos(clock.elapsedTime * 0.1) * 0.03;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.2, delta);
  });

  return (
    <group ref={group} scale={scale}>
      {PANELS.map((panel, i) => (
        <Float
          key={i}
          speed={still ? 0 : panel.speed}
          rotationIntensity={still ? 0 : 0.22}
          floatIntensity={still ? 0 : 0.7}
          floatingRange={[-0.16, 0.16]}
        >
          <RoundedBox
            args={panel.size}
            radius={0.08}
            smoothness={4}
            position={panel.position}
            rotation={panel.rotation}
          >
            <ToneMaterial tone={panel.tone} palette={palette} />
          </RoundedBox>
        </Float>
      ))}

      <Float speed={still ? 0 : 1.6} floatIntensity={still ? 0 : 0.9} rotationIntensity={still ? 0 : 0.5}>
        <mesh position={[-4.6, 0.35, 1.9]}>
          <sphereGeometry args={[0.42, 48, 48]} />
          <meshStandardMaterial
            color={palette.sphere.color}
            roughness={palette.sphere.roughness}
            metalness={palette.sphere.metalness}
          />
        </mesh>
      </Float>

      <Float speed={still ? 0 : 1.25} floatIntensity={still ? 0 : 0.8} rotationIntensity={still ? 0 : 0.6}>
        <mesh position={[5.1, -0.55, 1.7]} rotation={[0.4, 0.3, 0.1]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={palette.cube.color}
            roughness={palette.cube.roughness}
            metalness={palette.cube.metalness}
          />
        </mesh>
      </Float>

      <mesh position={[0.3, -0.2, -4.5]} rotation={[0.92, 0.38, 0.12]}>
        <torusGeometry args={[4.2, 0.014, 12, 128]} />
        <meshBasicMaterial color={palette.ring.color} transparent opacity={palette.ring.opacity} />
      </mesh>
    </group>
  );
}

export default function HeroScene({
  active = true,
  still = false,
  theme = "light",
}: {
  active?: boolean;
  still?: boolean;
  theme?: Theme;
}) {
  const palette = PALETTES[theme];

  return (
    <Canvas
      flat
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 12], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active && !still ? "always" : "demand"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[5, 6, 8]} intensity={palette.key} />
      <Composition still={still} palette={palette} />
      <Environment key={theme} resolution={256}>
        <color attach="background" args={[palette.env]} />
        <Lightformer intensity={palette.formers[0]} form="rect" position={[0, 5, -4]} scale={[12, 6, 1]} />
        <Lightformer
          intensity={palette.formers[1]}
          form="rect"
          position={[-7, 0, 3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[9, 9, 1]}
        />
        <Lightformer intensity={palette.formers[2]} form="ring" position={[6, 2, 3]} scale={3.5} />
      </Environment>
    </Canvas>
  );
}
