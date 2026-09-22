"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import type { StepId } from "@/lib/site";

const STROKE = "var(--viz-stroke)";
const SOFT = "var(--viz-soft)";
const MID = "var(--viz-mid)";
const INK = "var(--viz-ink)";
const SURFACE = "var(--viz-surface)";
const ON_INK = "var(--viz-on-ink)";

const VIEWBOX = "0 0 420 230";

const enter = (i: number) => ({
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay: 0.05 + i * 0.05, ease: EASE },
});

/** 01 — Descubrir: raw terrain, then the signal inside it. */
function Descubrir() {
  const scatter = [
    [38, 52], [96, 34], [150, 70], [206, 40], [262, 78], [318, 46], [368, 88],
    [52, 118], [108, 96], [168, 132], [224, 108], [286, 140], [342, 116],
    [70, 176], [130, 190], [192, 168], [250, 196], [308, 174], [366, 152],
  ];
  const selected = [2, 8, 11, 16, 18];
  const link = "M150 70L108 96M108 96L286 140M286 140L250 196M250 196L366 152";

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      {scatter.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="3" fill={MID} {...enter(i * 0.4)} />
      ))}

      <motion.path
        d={link}
        stroke={INK}
        strokeWidth="1"
        fill="none"
        strokeOpacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
      />

      {selected.map((index, i) => {
        const [x, y] = scatter[index];
        return (
          <motion.g key={index} {...enter(6 + i)}>
            <circle cx={x} cy={y} r="11" fill="none" stroke={INK} strokeOpacity="0.35" />
            <circle cx={x} cy={y} r="4" fill={INK} />
          </motion.g>
        );
      })}
    </svg>
  );
}

/** 02 — Diseñar: structure and language before pixels. */
function Disenar() {
  const blocks = [
    { x: 150, y: 74, w: 108, h: 44 },
    { x: 266, y: 74, w: 64, h: 44 },
    { x: 150, y: 126, w: 64, h: 62 },
    { x: 222, y: 126, w: 108, h: 62 },
  ];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      {[142, 258, 338].map((x) => (
        <path key={x} d={`M${x} 22V208`} stroke={STROKE} strokeDasharray="3 4" />
      ))}

      <motion.rect x="42" y="42" width="84" height="84" rx="12" fill={SURFACE} stroke={STROKE} {...enter(0)} />
      <motion.text
        x="84"
        y="98"
        textAnchor="middle"
        fontSize="42"
        fontWeight="500"
        fill={INK}
        letterSpacing="-2"
        {...enter(1)}
      >
        Aa
      </motion.text>
      <motion.g {...enter(2)}>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={42 + i * 22} y="146" width="16" height="16" rx="5" fill={i === 0 ? INK : SOFT} stroke={i === 0 ? "none" : STROKE} />
        ))}
      </motion.g>

      <motion.rect x="150" y="42" width="180" height="22" rx="7" fill={SOFT} stroke={STROKE} {...enter(1)} />
      {blocks.map((block, i) => (
        <motion.rect
          key={i}
          x={block.x}
          y={block.y}
          width={block.w}
          height={block.h}
          rx="9"
          fill={SURFACE}
          stroke={STROKE}
          {...enter(2 + i)}
        />
      ))}
      <motion.path d="M150 204h180" stroke={INK} strokeOpacity="0.25" {...enter(6)} />
      <motion.text x="240" y="220" textAnchor="middle" fontSize="9" fill={MID} fontFamily="var(--font-mono), monospace" {...enter(6)}>
        1440 / 12 col
      </motion.text>
    </svg>
  );
}

/** 03 — Construir: modules landing on top of each other. */
function Construir() {
  const slabs = [
    { y: 168, w: 260, x: 80 },
    { y: 132, w: 224, x: 98 },
    { y: 96, w: 188, x: 116 },
    { y: 60, w: 152, x: 134 },
  ];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      {slabs.map((slab, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 + (slabs.length - i) * 0.12, ease: EASE }}
        >
          <rect x={slab.x} y={slab.y} width={slab.w} height="28" rx="8" fill={SURFACE} stroke={STROKE} />
          <rect x={slab.x + 12} y={slab.y + 10} width="9" height="9" rx="2.5" fill={i === 3 ? INK : MID} />
          <rect x={slab.x + 28} y={slab.y + 11} width={slab.w * 0.42} height="3.5" rx="1.75" fill={SOFT} />
          <rect x={slab.x + slab.w - 34} y={slab.y + 11} width="22" height="3.5" rx="1.75" fill={SOFT} />
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }}>
        <rect x="80" y="208" width="260" height="5" rx="2.5" fill={SOFT} />
        <motion.rect
          x="80"
          y="208"
          height="5"
          rx="2.5"
          fill={INK}
          initial={{ width: 0 }}
          animate={{ width: 212 }}
          transition={{ duration: 1.6, delay: 0.9, ease: EASE }}
        />
      </motion.g>
    </svg>
  );
}

/** 04 — Automatizar: manual steps collapse into one pipeline. */
function Automatizar() {
  const stages = [40, 138, 236, 334];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      <path id="pipeline" d="M86 76h52m46 0h52m46 0h52" stroke={STROKE} fill="none" />

      {stages.map((x, i) => (
        <motion.g key={x} {...enter(i)}>
          <rect x={x} y="56" width="46" height="40" rx="10" fill={SURFACE} stroke={i === 3 ? INK : STROKE} strokeOpacity={i === 3 ? 0.8 : 1} />
          <rect x={x + 12} y="70" width="22" height="4" rx="2" fill={i === 3 ? INK : MID} />
          <rect x={x + 12} y="80" width="14" height="4" rx="2" fill={SOFT} />
        </motion.g>
      ))}

      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${86 + i * 98} 76h${52}`}
          stroke={INK}
          strokeOpacity="0.45"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.25, ease: EASE }}
        />
      ))}

      {[0, 1, 2, 3].map((i) => (
        <motion.g
          key={`manual-${i}`}
          initial={{ opacity: 0.9, x: 0 }}
          animate={{ opacity: 0.18, x: -10 }}
          transition={{ duration: 0.8, delay: 0.9 + i * 0.12, ease: EASE }}
        >
          <rect x="40" y={136 + i * 22} width={150 - i * 18} height="12" rx="6" fill={SOFT} stroke={STROKE} strokeWidth="0.7" />
          <path d={`M46 ${142 + i * 22}h${138 - i * 18}`} stroke={MID} strokeWidth="1" />
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.3, ease: EASE }}>
        <rect x="236" y="140" width="144" height="56" rx="12" fill={SURFACE} stroke={STROKE} />
        <circle cx="262" cy="168" r="10" fill={INK} />
        <path d="M257.5 168l3.5 3.5 6-7" stroke={ON_INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <rect x="282" y="160" width="76" height="4.5" rx="2.25" fill={SOFT} />
        <rect x="282" y="172" width="48" height="4.5" rx="2.25" fill={SOFT} />
      </motion.g>
    </svg>
  );
}

/** 05 — Evolucionar: the system keeps compounding. */
function Evolucionar() {
  const line = "M46 176C96 176 110 138 150 132s56 18 92-6 44-52 92-62";
  const points: [number, number][] = [
    [150, 132],
    [242, 126],
    [334, 64],
  ];

  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" role="presentation">
      <defs>
        <linearGradient id="evo-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={INK} stopOpacity="0.1" />
          <stop offset="100%" stopColor={INK} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[76, 126, 176].map((y) => (
        <path key={y} d={`M46 ${y}h336`} stroke={STROKE} strokeDasharray="2 5" />
      ))}
      <path d="M46 196h336" stroke={STROKE} />

      <motion.path
        d={`${line}L382 196H46Z`}
        fill="url(#evo-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7, ease: EASE }}
      />
      <motion.path
        d={line}
        stroke={INK}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
      />

      {points.map(([x, y], i) => (
        <motion.g key={i} {...enter(6 + i * 2)}>
          <circle cx={x} cy={y} r="9" fill={SURFACE} stroke={INK} strokeOpacity="0.2" />
          <circle cx={x} cy={y} r="3.5" fill={INK} />
        </motion.g>
      ))}

      <motion.g {...enter(10)}>
        <path
          d="M352 148a22 22 0 1 0 8-17"
          stroke={INK}
          strokeOpacity="0.4"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M356 124l4 8 8-3" stroke={INK} strokeOpacity="0.4" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

const VISUALS: Record<StepId, () => React.JSX.Element> = {
  descubrir: Descubrir,
  disenar: Disenar,
  construir: Construir,
  automatizar: Automatizar,
  evolucionar: Evolucionar,
};

export function ProcessVisual({ id }: { id: StepId }) {
  const Visual = VISUALS[id];
  return <Visual />;
}
