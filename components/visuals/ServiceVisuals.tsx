"use client";

import { motion } from "framer-motion";
import type { ServiceId } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const STROKE = "var(--viz-stroke)";
const SOFT = "var(--viz-soft)";
const MID = "var(--viz-mid)";
const INK = "var(--viz-ink)";
const SURFACE = "var(--viz-surface)";

const VIEWBOX = "0 0 240 150";

type VisualProps = { active: boolean };

/**
 * Loops start and end on the resting value so the static state — what users
 * with reduced motion see — is the finished composition, not a blank frame.
 */
function loop(duration: number, delay = 0) {
  return {
    duration,
    delay,
    repeat: Infinity,
    repeatType: "loop" as const,
    ease: "easeInOut" as const,
  };
}

/** 01 — Desarrollo digital: surfaces assembling into a product. */
function DevVisual({ active }: VisualProps) {
  const bars = [
    { y: 62, w: 74 },
    { y: 76, w: 96 },
    { y: 90, w: 58 },
  ];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      <motion.g animate={active ? { y: [0, -3, 0] } : undefined} transition={loop(7)}>
        <rect x="24" y="30" width="136" height="94" rx="9" fill={SURFACE} stroke={STROKE} />
        <path d="M24 44h136" stroke={STROKE} />
        {[33, 41, 49].map((cx) => (
          <circle key={cx} cx={cx} cy="37" r="2.4" fill={MID} />
        ))}
        <rect x="34" y="54" width="42" height="6" rx="3" fill={INK} opacity="0.85" />
        {bars.map((bar, i) => (
          <motion.rect
            key={bar.y}
            x="34"
            y={bar.y}
            width={bar.w}
            height="6"
            rx="3"
            fill={SOFT}
            stroke={STROKE}
            strokeWidth="0.6"
            style={{ originX: 0, transformBox: "fill-box" }}
            animate={active ? { scaleX: [1, 0.15, 1, 1], opacity: [1, 0.4, 1, 1] } : undefined}
            transition={loop(5.6, i * 0.3)}
          />
        ))}
        <rect x="34" y="104" width="30" height="10" rx="5" fill={INK} />
      </motion.g>

      <motion.g animate={active ? { y: [0, 5, 0] } : undefined} transition={loop(6, 0.6)}>
        <rect x="168" y="46" width="48" height="78" rx="11" fill={SURFACE} stroke={STROKE} />
        <rect x="186" y="52" width="12" height="3" rx="1.5" fill={MID} />
        <rect x="176" y="64" width="32" height="24" rx="5" fill={SOFT} />
        {[94, 102, 110].map((y, i) => (
          <rect key={y} x="176" y={y} width={i === 2 ? 18 : 32} height="4" rx="2" fill={SOFT} />
        ))}
      </motion.g>
    </svg>
  );
}

/** 02 — Automatización: connected nodes with a packet in transit. */
function AutoVisual({ active }: VisualProps) {
  const nodes = [
    { x: 20, y: 26 },
    { x: 92, y: 62 },
    { x: 164, y: 26 },
    { x: 92, y: 104 },
  ];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      <path id="flow-a" d="M76 39C86 39 88 75 100 75" stroke={STROKE} fill="none" />
      <path id="flow-b" d="M148 75C160 75 162 39 172 39" stroke={STROKE} fill="none" />
      <path d="M120 88v16" stroke={STROKE} strokeDasharray="3 3" fill="none" />

      {nodes.map((node, i) => (
        <g key={i}>
          <rect
            x={node.x}
            y={node.y}
            width="56"
            height="26"
            rx="8"
            fill={SURFACE}
            stroke={i === 1 ? INK : STROKE}
            strokeOpacity={i === 1 ? 0.85 : 1}
          />
          <rect x={node.x + 8} y={node.y + 9} width="8" height="8" rx="2.5" fill={i === 1 ? INK : MID} />
          <rect x={node.x + 21} y={node.y + 10} width="24" height="3" rx="1.5" fill={SOFT} />
          <rect x={node.x + 21} y={node.y + 16} width="14" height="3" rx="1.5" fill={SOFT} />
        </g>
      ))}

      {active ? (
        <>
          <circle r="3.4" fill={INK}>
            <animateMotion dur="2.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keyPoints="0;1" keySplines="0.4 0 0.2 1">
              <mpath href="#flow-a" />
            </animateMotion>
          </circle>
          <circle r="3.4" fill={INK}>
            <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keyPoints="0;1" keySplines="0.4 0 0.2 1">
              <mpath href="#flow-b" />
            </animateMotion>
          </circle>
        </>
      ) : null}
    </svg>
  );
}

/** 03 — Datos & BI: measurement taking shape. */
function DataVisual({ active }: VisualProps) {
  const bars = [30, 52, 38, 72, 58, 86];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      {[46, 74, 102].map((y) => (
        <path key={y} d={`M26 ${y}h188`} stroke={STROKE} strokeDasharray="2 4" opacity="0.7" />
      ))}
      <path d="M26 118h188" stroke={STROKE} />

      {bars.map((height, i) => (
        <motion.rect
          key={i}
          x={34 + i * 30}
          y={118 - height}
          width="16"
          height={height}
          rx="4"
          fill={i === bars.length - 1 ? INK : SOFT}
          stroke={i === bars.length - 1 ? "none" : STROKE}
          strokeWidth="0.7"
          style={{ originY: 1, transformBox: "fill-box" }}
          animate={active ? { scaleY: [1, 0.22, 1, 1] } : undefined}
          transition={loop(6, i * 0.16)}
        />
      ))}

      <path
        d="M42 70C64 70 74 44 102 52s34 22 60 8 24-30 40-36"
        stroke={INK}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
    </svg>
  );
}

/** 04 — IA & APIs: a request answered by a model. */
function AiVisual({ active }: VisualProps) {
  const dots = Array.from({ length: 16 }, (_, i) => ({
    x: 152 + (i % 4) * 18,
    y: 44 + Math.floor(i / 4) * 18,
    base: 0.14 + ((i * 5) % 7) * 0.09,
    i,
  }));

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      <rect x="20" y="42" width="72" height="66" rx="9" fill={SURFACE} stroke={STROKE} />
      <text x="30" y="60" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill={MID} letterSpacing="0.5">
        POST /v1
      </text>
      {[70, 80, 90].map((y, i) => (
        <rect key={y} x="30" y={y} width={i === 1 ? 50 : 36} height="4" rx="2" fill={SOFT} />
      ))}

      <path id="req-path" d="M92 68h38" stroke={STROKE} fill="none" />
      <path id="res-path" d="M130 90H92" stroke={STROKE} fill="none" strokeDasharray="3 3" />

      <rect x="138" y="30" width="86" height="90" rx="10" fill={SURFACE} stroke={STROKE} />
      {dots.map((dot) => (
        <motion.circle
          key={dot.i}
          cx={dot.x}
          cy={dot.y}
          r="3"
          fill={INK}
          opacity={dot.base}
          animate={active ? { opacity: [dot.base, 0.92, dot.base] } : undefined}
          transition={loop(3.4, (dot.i % 7) * 0.24)}
        />
      ))}
      <rect x="152" y="98" width="58" height="4" rx="2" fill={SOFT} />
      <rect x="152" y="107" width="34" height="4" rx="2" fill={SOFT} />

      {active ? (
        <>
          <circle r="3.2" fill={INK}>
            <animateMotion dur="2.4s" repeatCount="indefinite">
              <mpath href="#req-path" />
            </animateMotion>
          </circle>
          <circle r="3.2" fill={MID}>
            <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite">
              <mpath href="#res-path" />
            </animateMotion>
          </circle>
        </>
      ) : null}
    </svg>
  );
}

/** 05 — Sistemas SaaS: modules resolving into one platform. */
function SaasVisual({ active }: VisualProps) {
  const layers = [
    { y: 86, w: 140, x: 50, lift: 12 },
    { y: 66, w: 124, x: 58, lift: 6 },
    { y: 46, w: 108, x: 66, lift: 0 },
  ];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      {layers.map((layer, i) => (
        <motion.g
          key={i}
          animate={active ? { y: [0, layer.lift, 0] } : undefined}
          transition={loop(6.5, i * 0.25)}
        >
          <rect x={layer.x} y={layer.y} width={layer.w} height="30" rx="8" fill={SURFACE} stroke={STROKE} />
          <rect x={layer.x + 12} y={layer.y + 11} width="10" height="8" rx="2.5" fill={i === 2 ? INK : MID} />
          <rect x={layer.x + 28} y={layer.y + 12} width={layer.w - 60} height="3" rx="1.5" fill={SOFT} />
          <rect x={layer.x + 28} y={layer.y + 18} width={(layer.w - 60) * 0.5} height="3" rx="1.5" fill={SOFT} />
        </motion.g>
      ))}

      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={80 + i * 28}
          y="20"
          width="18"
          height="14"
          rx="4"
          fill={SOFT}
          stroke={STROKE}
          strokeWidth="0.7"
          animate={active ? { y: [0, -7, 0], opacity: [1, 0.35, 1] } : undefined}
          transition={loop(6.5, 0.5 + i * 0.3)}
        />
      ))}
    </svg>
  );
}

const VISUALS: Record<ServiceId, (props: VisualProps) => React.JSX.Element> = {
  dev: DevVisual,
  auto: AutoVisual,
  data: DataVisual,
  ai: AiVisual,
  saas: SaasVisual,
};

export function ServiceVisual({ id, inView }: { id: ServiceId; inView: boolean }) {
  const reduce = useReducedMotionSafe();
  const Visual = VISUALS[id];

  return <Visual active={inView && !reduce} />;
}
