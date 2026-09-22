"use client";

import { motion } from "framer-motion";
import { M, MONO, pop, SANS, VIEWBOX } from "./tokens";

const MENU = ["Nuevo", "Objetos", "Colección", "Estudio"];
const PRODUCTS = [
  { name: "Ánfora", price: "€ 120", width: 88 },
  { name: "Lumen", price: "€ 240", width: 72 },
  { name: "Banco 01", price: "€ 480", width: 96 },
  { name: "Vaso Ito", price: "€ 60", width: 68 },
];

function Silhouette({ index, cx, cy }: { index: number; cx: number; cy: number }) {
  const fill = "url(#kora-object)";

  if (index === 0) {
    return (
      <g>
        <rect x={cx - 27} y={cy - 46} width="54" height="104" rx="24" fill={fill} />
        <rect x={cx - 11} y={cy - 70} width="22" height="30" rx="9" fill={fill} />
      </g>
    );
  }
  if (index === 1) {
    return (
      <g>
        <circle cx={cx} cy={cy - 22} r="36" fill={fill} />
        <rect x={cx - 4} y={cy + 8} width="8" height="44" rx="4" fill={fill} />
        <ellipse cx={cx} cy={cy + 56} rx="32" ry="8" fill={fill} />
      </g>
    );
  }
  if (index === 2) {
    return (
      <g>
        <rect x={cx - 46} y={cy - 56} width="92" height="52" rx="18" fill={fill} />
        <rect x={cx - 46} y={cy - 2} width="92" height="16" rx="8" fill={fill} />
        <rect x={cx - 40} y={cy + 14} width="10" height="44" rx="5" fill={fill} />
        <rect x={cx + 30} y={cy + 14} width="10" height="44" rx="5" fill={fill} />
      </g>
    );
  }
  return (
    <g>
      <path
        d={`M${cx - 30} ${cy - 40}h60l-8 76a22 22 0 0 1-44 0Z`}
        fill={fill}
      />
      <ellipse cx={cx} cy={cy - 40} rx="30" ry="10" fill={fill} />
    </g>
  );
}

export function KoraMockup() {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMinYMin slice"
      className="absolute inset-0 h-full w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id="kora-object" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={M.objectFrom} />
          <stop offset="100%" stopColor={M.objectTo} />
        </linearGradient>
        <linearGradient id="kora-hero-object" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={M.objectFrom} />
          <stop offset="100%" stopColor={M.objectTo} />
        </linearGradient>
      </defs>

      <rect width="1200" height="750" fill={M.surface} />

      {/* site header */}
      <text x="48" y="48" fontFamily={SANS} fontSize="19" fontWeight="500" letterSpacing="5" fill={M.ink}>
        KORA
      </text>
      {MENU.map((item, i) => (
        <text key={item} x={452 + i * 92} y="47" fontFamily={SANS} fontSize="11.5" fill={M.text}>
          {item}
        </text>
      ))}
      <circle cx="1094" cy="42" r="5.5" fill="none" stroke={M.mid} strokeWidth="1.4" />
      <path d="M1098 46l4 4" stroke={M.mid} strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M1132 34h28l4 20h-36z"
        fill="none"
        stroke={M.ink}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="1164" cy="32" r="8" fill={M.ink} />
      <text x="1164" y="35.5" textAnchor="middle" fontFamily={MONO} fontSize="8" fill={M.onInk}>
        2
      </text>
      <path d="M0 76h1200" stroke={M.line} />

      {/* hero */}
      <motion.g {...pop(0.05)}>
        <rect x="48" y="108" width="1104" height="286" rx="22" fill={M.soft} />
        <text x="96" y="178" fontFamily={MONO} fontSize="10" letterSpacing="2" fill={M.text}>
          COLECCIÓN 04
        </text>
        <text x="96" y="236" fontFamily={SANS} fontSize="40" fontWeight="500" letterSpacing="-1.6" fill={M.ink}>
          Objetos esenciales
        </text>
        <text x="96" y="266" fontFamily={SANS} fontSize="13" fill={M.text}>
          Materiales simples, funciones claras.
        </text>
        <rect x="96" y="292" width="136" height="42" rx="21" fill={M.ink} />
        <text x="164" y="318" textAnchor="middle" fontFamily={SANS} fontSize="12.5" fill={M.onInk}>
          Comprar
        </text>

        <ellipse cx="884" cy="352" rx="128" ry="14" fill={M.ink} fillOpacity="0.05" />
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="806" y="158" width="118" height="186" rx="44" fill="url(#kora-hero-object)" />
          <circle cx="962" cy="252" r="58" fill="url(#kora-hero-object)" />
          <rect x="770" y="266" width="62" height="78" rx="22" fill="url(#kora-hero-object)" />
        </motion.g>
      </motion.g>

      {/* product grid */}
      {PRODUCTS.map((product, i) => (
        <motion.g key={product.name} {...pop(0.18 + i * 0.08)}>
          <rect x={48 + i * 288} y="430" width="264" height="272" rx="18" fill={M.softer} stroke={M.line} />
          <Silhouette index={i} cx={180 + i * 288} cy={528} />
          <path d={`M${48 + i * 288} 632h264`} stroke={M.line} />
          <text x={76 + i * 288} y="662" fontFamily={SANS} fontSize="13" fontWeight="500" fill={M.ink}>
            {product.name}
          </text>
          <text x={76 + i * 288} y="682" fontFamily={MONO} fontSize="10.5" fill={M.text}>
            {product.price}
          </text>
          <circle cx={280 + i * 288} cy="668" r="13" fill={M.surface} stroke={M.line} />
          <path
            d={`M${274 + i * 288} 668h12M${280 + i * 288} 662v12`}
            stroke={M.ink}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      <text x="48" y="734" fontFamily={MONO} fontSize="10" letterSpacing="1.4" fill={M.mid}>
        ENVÍO EN 48 H · INVENTARIO EN TIEMPO REAL
      </text>
    </svg>
  );
}
