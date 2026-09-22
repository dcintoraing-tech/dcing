"use client";

import { motion } from "framer-motion";
import { M, MONO, pop, SANS, VIEWBOX } from "./tokens";

const DAYS = ["01", "05", "09", "13", "17", "21", "25", "30"];

const LINE_A = "M96 342C150 342 176 268 232 258s72 34 124 8 76-116 132-124 84 62 138 46 54-72 86-88";
const LINE_B = "M96 372C150 372 178 336 232 330s70 22 124 6 78-56 132-62 86 34 138 24 54-34 86-44";

const RADIUS = 66;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SEGMENTS = [
  { label: "Producto", value: "38%", share: 0.38, color: M.ink },
  { label: "Operación", value: "27%", share: 0.27, color: M.text },
  { label: "Soporte", value: "21%", share: 0.21, color: M.mid },
  { label: "Otros", value: "14%", share: 0.14, color: M.line },
];

const ARCS = SEGMENTS.map((segment, i) => ({
  ...segment,
  length: CIRCUMFERENCE * segment.share,
  start: CIRCUMFERENCE * SEGMENTS.slice(0, i).reduce((sum, s) => sum + s.share, 0),
}));

const TABLE = [
  { name: 148, code: "canal / directo", value: "24 810", meter: 0.86, delta: "+14%" },
  { name: 112, code: "canal / búsqueda", value: "18 402", meter: 0.64, delta: "+9%" },
  { name: 176, code: "canal / campañas", value: "11 275", meter: 0.42, delta: "−3%" },
  { name: 128, code: "canal / referidos", value: "6 940", meter: 0.26, delta: "+21%" },
];

export function NucleoMockup() {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMinYMin slice"
      className="absolute inset-0 h-full w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id="ncl-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={M.ink} stopOpacity="0.1" />
          <stop offset="100%" stopColor={M.ink} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1200" height="750" fill={M.surface} />

      {/* top bar */}
      <text x="48" y="42" fontFamily={SANS} fontSize="17" fontWeight="500" fill={M.ink}>
        Núcleo
      </text>
      <text x="126" y="42" fontFamily={MONO} fontSize="10.5" letterSpacing="1.4" fill={M.text}>
        ANÁLISIS DIARIO
      </text>
      <rect x="820" y="16" width="192" height="32" rx="16" fill={M.soft} />
      {["Día", "Semana", "Mes"].map((item, i) => (
        <g key={item}>
          {i === 2 ? <rect x="946" y="18" width="64" height="28" rx="14" fill={M.surface} stroke={M.line} /> : null}
          <text
            x={852 + i * 64}
            y="36"
            textAnchor="middle"
            fontFamily={SANS}
            fontSize="11"
            fill={i === 2 ? M.ink : M.text}
          >
            {item}
          </text>
        </g>
      ))}
      <rect x="1028" y="16" width="124" height="32" rx="16" fill={M.surface} stroke={M.line} />
      <text x="1090" y="36" textAnchor="middle" fontFamily={MONO} fontSize="10" fill={M.text}>
        01 — 30 SEP
      </text>
      <path d="M0 64h1200" stroke={M.line} />

      {/* main chart */}
      <motion.g {...pop(0.05)}>
        <rect x="48" y="96" width="712" height="330" rx="18" fill={M.surface} stroke={M.line} />
        <text x="76" y="132" fontFamily={SANS} fontSize="13.5" fontWeight="500" fill={M.ink}>
          Sesiones por canal
        </text>
        <circle cx="560" cy="127" r="4" fill={M.ink} />
        <text x="572" y="131" fontFamily={MONO} fontSize="9.5" fill={M.text}>
          ESTE MES
        </text>
        <circle cx="654" cy="127" r="4" fill={M.mid} />
        <text x="666" y="131" fontFamily={MONO} fontSize="9.5" fill={M.text}>
          ANTERIOR
        </text>

        {[196, 262, 328].map((y) => (
          <path key={y} d={`M96 ${y}h616`} stroke={M.line} strokeDasharray="2 5" />
        ))}
        <path d="M96 394h616" stroke={M.line} />

        <motion.path
          d={`${LINE_A}L712 394H96Z`}
          fill="url(#ncl-area)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.9 }}
        />
        <motion.path
          d={LINE_B}
          stroke={M.mid}
          strokeWidth="1.8"
          strokeDasharray="5 5"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d={LINE_A}
          stroke={M.ink}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {DAYS.map((day, i) => (
          <text key={day} x={100 + i * 88} y="416" fontFamily={MONO} fontSize="8.5" fill={M.mid}>
            {day}
          </text>
        ))}

        <motion.g {...pop(1.2)}>
          <path d="M488 150v244" stroke={M.ink} strokeOpacity="0.18" strokeDasharray="3 3" />
          <circle cx="488" cy="198" r="5" fill={M.ink} />
          <rect x="424" y="140" width="128" height="48" rx="10" fill={M.ink} />
          <text x="440" y="161" fontFamily={MONO} fontSize="8.5" fill={M.onInk} fillOpacity="0.5">
            17 SEP · PICO
          </text>
          <text x="440" y="178" fontFamily={SANS} fontSize="13" fontWeight="500" fill={M.onInk}>
            32 480 sesiones
          </text>
        </motion.g>
      </motion.g>

      {/* distribution */}
      <motion.g {...pop(0.14)}>
        <rect x="784" y="96" width="368" height="330" rx="18" fill={M.surface} stroke={M.line} />
        <text x="812" y="132" fontFamily={SANS} fontSize="13.5" fontWeight="500" fill={M.ink}>
          Distribución
        </text>

        <g transform="translate(892, 252) rotate(-90)">
          {ARCS.map((arc) => (
            <motion.circle
              key={arc.label}
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth="24"
              strokeDasharray={`${arc.length - 3} ${CIRCUMFERENCE - arc.length + 3}`}
              strokeDashoffset={-arc.start}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </g>
        <text x="892" y="250" textAnchor="middle" fontFamily={SANS} fontSize="22" fontWeight="500" fill={M.ink}>
          61.4K
        </text>
        <text x="892" y="270" textAnchor="middle" fontFamily={MONO} fontSize="9" fill={M.text}>
          TOTAL
        </text>

        {SEGMENTS.map((segment, i) => (
          <g key={segment.label} transform={`translate(1000, ${180 + i * 36})`}>
            <rect width="10" height="10" rx="3" fill={segment.color} />
            <text x="20" y="9.5" fontFamily={SANS} fontSize="11" fill={M.ink}>
              {segment.label}
            </text>
            <text x="120" y="9.5" textAnchor="end" fontFamily={MONO} fontSize="10" fill={M.text}>
              {segment.value}
            </text>
          </g>
        ))}
      </motion.g>

      {/* table */}
      <motion.g {...pop(0.22)}>
        <rect x="48" y="458" width="1104" height="250" rx="18" fill={M.surface} stroke={M.line} />
        <path d="M48 500h1104" stroke={M.line} />
        {["ORIGEN", "SESIONES", "PARTICIPACIÓN", "VARIACIÓN"].map((head, i) => (
          <text
            key={head}
            x={i === 0 ? 76 : 76 + i * 296}
            y="486"
            fontFamily={MONO}
            fontSize="9"
            letterSpacing="1.5"
            fill={M.text}
          >
            {head}
          </text>
        ))}

        {TABLE.map((row, i) => (
          <g key={row.code} transform={`translate(0, ${i * 50})`}>
            <rect x="76" y="524" width={row.name} height="7" rx="3.5" fill={M.soft} />
            <text x="76" y="548" fontFamily={MONO} fontSize="8.5" fill={M.mid}>
              {row.code}
            </text>
            <text x="372" y="534" fontFamily={MONO} fontSize="11" fill={M.ink}>
              {row.value}
            </text>
            <rect x="668" y="524" width="180" height="7" rx="3.5" fill={M.soft} />
            <motion.rect
              x="668"
              y="524"
              height="7"
              rx="3.5"
              fill={M.ink}
              fillOpacity="0.75"
              initial={{ width: 0 }}
              whileInView={{ width: 180 * row.meter }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <text x="964" y="534" fontFamily={MONO} fontSize="11" fill={M.text}>
              {row.delta}
            </text>
            {i < TABLE.length - 1 ? <path d="M48 566h1104" stroke={M.line} /> : null}
          </g>
        ))}
      </motion.g>
    </svg>
  );
}
