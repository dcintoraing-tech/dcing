"use client";

import { motion } from "framer-motion";
import { M, MONO, pop, SANS, VIEWBOX } from "./tokens";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const NODES = [
  { x: 260, y: 190, title: "Entrada", meta: "webhook · erp", selected: false },
  { x: 560, y: 110, title: "Validar", meta: "reglas · 14", selected: false },
  { x: 560, y: 290, title: "Enriquecer", meta: "api · clientes", selected: false },
  { x: 860, y: 190, title: "Enrutar", meta: "condición", selected: true },
  { x: 860, y: 390, title: "Notificar", meta: "correo · chat", selected: false },
  { x: 560, y: 470, title: "Registrar", meta: "almacén", selected: false },
];

const EDGES = [
  "M456 226C506 226 510 146 560 146",
  "M456 226C506 226 510 326 560 326",
  "M756 146C806 146 810 226 860 226",
  "M756 326C806 326 810 226 860 226",
  "M958 262v128",
  "M658 362v108",
];

const LIBRARY = ["Disparador", "Condición", "Transformar", "Consultar", "Escribir", "Alertar"];

export function AtlasMockup() {
  const reduce = useReducedMotionSafe();

  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMinYMin slice"
      className="absolute inset-0 h-full w-full"
      role="presentation"
    >
      <defs>
        <pattern id="atlas-dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.3" fill={M.line} />
        </pattern>
      </defs>

      <rect width="1200" height="750" fill={M.surface} />
      <rect x="200" y="56" width="1000" height="644" fill="url(#atlas-dots)" />

      {/* toolbar */}
      <path d="M0 56h1200" stroke={M.line} />
      <text x="28" y="34" fontFamily={MONO} fontSize="11" letterSpacing="1.2" fill={M.text}>
        ATLAS · ORQUESTADOR
      </text>
      <rect x="520" y="14" width="168" height="28" rx="14" fill={M.soft} />
      <rect x="522" y="16" width="82" height="24" rx="12" fill={M.surface} stroke={M.line} />
      <text x="563" y="32" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fill={M.ink}>
        Diseño
      </text>
      <text x="646" y="32" textAnchor="middle" fontFamily={SANS} fontSize="10.5" fill={M.text}>
        Ejecución
      </text>
      <circle cx="1068" cy="28" r="13" fill={M.soft} />
      <circle cx="1100" cy="28" r="13" fill={M.soft} />
      <rect x="1120" y="15" width="56" height="26" rx="13" fill={M.ink} />
      <text x="1148" y="32" textAnchor="middle" fontFamily={SANS} fontSize="10" fill={M.onInk}>
        Activo
      </text>

      {/* library */}
      <path d="M200 56v644" stroke={M.line} />
      <text x="24" y="92" fontFamily={MONO} fontSize="9.5" letterSpacing="1.5" fill={M.text}>
        BLOQUES
      </text>
      {LIBRARY.map((item, i) => (
        <motion.g key={item} {...pop(0.05 + i * 0.05)}>
          <rect x="20" y={110 + i * 54} width="160" height="44" rx="11" fill={M.softer} stroke={M.line} />
          <rect x="34" y={126 + i * 54} width="14" height="14" rx="4" fill={M.mid} />
          <text x="58" y={137 + i * 54} fontFamily={SANS} fontSize="11" fill={M.ink}>
            {item}
          </text>
        </motion.g>
      ))}

      {/* edges */}
      {EDGES.map((d, i) => (
        <g key={d}>
          <path id={`atlas-edge-${i}`} d={d} stroke={M.mid} strokeWidth="1.6" fill="none" />
          <motion.path
            d={d}
            stroke={M.ink}
            strokeOpacity="0.5"
            strokeWidth="1.6"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          />
        </g>
      ))}

      {/* nodes */}
      {NODES.map((node, i) => (
        <motion.g key={node.title} {...pop(0.12 + i * 0.07)}>
          <rect
            x={node.x}
            y={node.y}
            width="196"
            height="72"
            rx="14"
            fill={M.surface}
            stroke={node.selected ? M.ink : M.line}
            strokeWidth={node.selected ? 1.6 : 1}
          />
          <rect x={node.x + 18} y={node.y + 20} width="18" height="18" rx="5.5" fill={node.selected ? M.ink : M.mid} />
          <text x={node.x + 48} y={node.y + 31} fontFamily={SANS} fontSize="12.5" fontWeight="500" fill={M.ink}>
            {node.title}
          </text>
          <text x={node.x + 48} y={node.y + 50} fontFamily={MONO} fontSize="9" fill={M.text}>
            {node.meta}
          </text>
          <circle cx={node.x} cy={node.y + 36} r="3.5" fill={M.surface} stroke={M.mid} />
          <circle cx={node.x + 196} cy={node.y + 36} r="3.5" fill={M.surface} stroke={M.mid} />

          {node.selected
            ? [
                [node.x, node.y],
                [node.x + 196, node.y],
                [node.x, node.y + 72],
                [node.x + 196, node.y + 72],
              ].map(([hx, hy]) => (
                <rect key={`${hx}-${hy}`} x={hx - 3.5} y={hy - 3.5} width="7" height="7" rx="1.5" fill={M.surface} stroke={M.ink} />
              ))
            : null}
        </motion.g>
      ))}

      {/* packets in transit */}
      {!reduce
        ? [0, 2, 4].map((edge, i) => (
            <circle key={edge} r="4.5" fill={M.ink}>
              <animateMotion dur="2.8s" begin={`${i * 0.7}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keyPoints="0;1" keySplines="0.4 0 0.2 1">
                <mpath href={`#atlas-edge-${edge}`} />
              </animateMotion>
            </circle>
          ))
        : null}

      {/* status bar */}
      <path d="M200 700h1000" stroke={M.line} />
      <text x="232" y="728" fontFamily={MONO} fontSize="10" fill={M.text}>
        14 SISTEMAS CONECTADOS
      </text>
      <text x="470" y="728" fontFamily={MONO} fontSize="10" fill={M.text}>
        3.2 S PROMEDIO
      </text>
      <text x="660" y="728" fontFamily={MONO} fontSize="10" fill={M.text}>
        0 ERRORES / 24 H
      </text>
      <circle cx="1160" cy="724" r="5" fill={M.ink} />
    </svg>
  );
}
