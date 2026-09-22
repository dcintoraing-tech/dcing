"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import type { Theme } from "@/lib/theme";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const COLS = 15;
const ROWS = 9;
const SPACING = 0.78;
const CUBE = 0.26;
/** Empty core of the ordered lattice — the headline sits inside it. */
const HOLE_X = 3.7;
const HOLE_Y = 1.7;
/** World width the ordered lattice occupies, used to fit it to the viewport. */
const LATTICE_WIDTH = (COLS - 1) * SPACING + CUBE;

type Cell = {
  ordered: THREE.Vector3;
  chaos: THREE.Vector3;
  chaosRotation: THREE.Euler;
  chaosScale: number;
  delay: number;
  tone: number;
};

function buildCells(): Cell[] {
  // Deterministic pseudo-random keeps server and client renders identical.
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = (c - (COLS - 1) / 2) * SPACING;
      const y = (r - (ROWS - 1) / 2) * SPACING;
      if (Math.abs(x) < HOLE_X && Math.abs(y) < HOLE_Y) continue;

      cells.push({
        ordered: new THREE.Vector3(x, y, 0),
        chaos: new THREE.Vector3(
          (random() - 0.5) * 15,
          (random() - 0.5) * 9,
          (random() - 0.5) * 11 - 1,
        ),
        chaosRotation: new THREE.Euler(
          (random() - 0.5) * Math.PI * 2,
          (random() - 0.5) * Math.PI * 2,
          (random() - 0.5) * Math.PI * 2,
        ),
        chaosScale: 0.45 + random() * 1.35,
        delay: random() * 0.34,
        tone: random(),
      });
    }
  }
  return cells;
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Lattice({
  progress,
  still,
  theme,
}: {
  progress: MotionValue<number>;
  still: boolean;
  theme: Theme;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const cells = useMemo(() => buildCells(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const viewportWidth = useThree((state) => state.viewport.width);
  const invalidate = useThree((state) => state.invalidate);
  const scale = Math.min(1, (viewportWidth * 0.94) / LATTICE_WIDTH);

  // On-demand frames only paint when asked; the first one must come after mount.
  useEffect(() => invalidate(), [invalidate, still, cells]);

  useEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    // Cubes must stay lighter than the page in dark, darker than it in light.
    const floor = theme === "dark" ? 0.3 : 0.24;
    const span = theme === "dark" ? 0.66 : 0.56;
    const color = new THREE.Color();
    cells.forEach((cell, i) => instanced.setColorAt(i, color.setScalar(floor + cell.tone * span)));
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    invalidate();
  }, [cells, theme, invalidate]);

  useFrame((state) => {
    const instanced = mesh.current;
    if (!instanced) return;

    const p = still ? 1 : THREE.MathUtils.clamp(progress.get(), 0, 1);

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const t = easeInOut(THREE.MathUtils.clamp((p - cell.delay) / 0.62, 0, 1));

      dummy.position.lerpVectors(cell.chaos, cell.ordered, t);
      dummy.rotation.set(
        cell.chaosRotation.x * (1 - t),
        cell.chaosRotation.y * (1 - t),
        cell.chaosRotation.z * (1 - t),
      );
      const s = THREE.MathUtils.lerp(cell.chaosScale, 1, t);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }

    instanced.instanceMatrix.needsUpdate = true;
    state.camera.position.z = THREE.MathUtils.lerp(13.6, 11.8, p);
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, cells.length]}
      scale={scale}
      rotation={[0.1, -0.16, 0]}
      frustumCulled={false}
    >
      <boxGeometry args={[CUBE, CUBE, CUBE]} />
      <meshStandardMaterial roughness={0.38} metalness={0.25} />
    </instancedMesh>
  );
}

export default function TransformScene({
  progress,
  active = true,
  still = false,
  theme = "light",
}: {
  progress: MotionValue<number>;
  active?: boolean;
  still?: boolean;
  theme?: Theme;
}) {
  const dark = theme === "dark";

  return (
    <Canvas
      flat
      dpr={[1, 1.7]}
      camera={{ position: [0, 0, 13.6], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active && !still ? "always" : "demand"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={dark ? 0.4 : 0.55} />
      <directionalLight position={[4, 7, 9]} intensity={dark ? 0.9 : 1.1} />
      <Lattice progress={progress} still={still} theme={theme} />
      <Environment key={theme} resolution={128}>
        <color attach="background" args={[dark ? "#191920" : "#ededee"]} />
        <Lightformer intensity={dark ? 2.2 : 2.6} form="rect" position={[0, 6, -3]} scale={[14, 7, 1]} />
        <Lightformer
          intensity={dark ? 1.2 : 1.4}
          form="rect"
          position={[-8, 0, 4]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 8, 1]}
        />
      </Environment>
    </Canvas>
  );
}
