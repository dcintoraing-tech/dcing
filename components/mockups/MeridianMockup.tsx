"use client";

import { motion } from "framer-motion";
import { M, MONO, pop, SANS, VIEWBOX } from "./tokens";

const KPIS = [
  { label: "INGRESOS", value: "€ 482.9K", delta: "+12.4%", spark: "M0 34C14 34 22 18 38 22s20 10 34 2 18-20 34-24" },
  { label: "MARGEN", value: "38.4 %", delta: "+3.1%", spark: "M0 30C16 30 20 24 34 26s22 4 34-8 20-14 38-16" },
  { label: "CLIENTES", value: "1 284", delta: "+86", spark: "M0 36C18 36 24 26 36 28s18 14 32 6 22-22 38-26" },
];

const MONTHS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

const ROWS = [
  { name: 148, code: "TRX-8841", amount: "€ 12 480" },
  { name: 112, code: "TRX-8840", amount: "€ 3 120" },
  { name: 166, code: "TRX-8839", amount: "€ 28 950" },
  { name: 96, code: "TRX-8838", amount: "€ 1 040" },
];

const CHART_LINE =
  "M152 466C196 466 214 404 258 398s56 34 92 10 52-92 96-96 62 58 98 44 54-78 92-92 56-6 92-30";

export function MeridianMockup() {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMinYMin slice"
      className="absolute inset-0 h-full w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id="mrd-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={M.ink} stopOpacity="0.12" />
          <stop offset="100%" stopColor={M.ink} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1200" height="750" fill={M.surface} />

      {/* sidebar */}
      <rect width="88" height="750" fill={M.softer} />
      <path d="M88 0v750" stroke={M.line} />
      <rect x="27" y="26" width="34" height="34" rx="11" fill={M.ink} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x="30"
          y={96 + i * 44}
          width="28"
          height="28"
          rx="9"
          fill={i === 0 ? M.ink : M.soft}
          fillOpacity={i === 0 ? 0.9 : 1}
        />
      ))}
      <circle cx="44" cy="700" r="15" fill={M.soft} />

      {/* top bar */}
      <path d="M88 72h1112" stroke={M.line} />
      <text x="120" y="45" fontFamily={SANS} fontSize="17" fontWeight="500" fill={M.ink}>
        Resumen
      </text>
      <text x="204" y="45" fontFamily={MONO} fontSize="11" fill={M.text}>
        / finanzas · Q4
      </text>
      <rect x="812" y="22" width="188" height="30" rx="15" fill={M.soft} />
      <circle cx="834" cy="37" r="5" fill="none" stroke={M.mid} strokeWidth="1.4" />
      <path d="M838 41l4 4" stroke={M.mid} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="1012" y="22" width="74" height="30" rx="15" fill={M.ink} />
      <text x="1049" y="42" textAnchor="middle" fontFamily={SANS} fontSize="11" fill={M.onInk}>
        Nuevo
      </text>
      <circle cx="1130" cy="37" r="16" fill={M.soft} />

      {/* kpi cards */}
      {KPIS.map((kpi, i) => (
        <motion.g key={kpi.label} {...pop(0.05 + i * 0.08)}>
          <rect x={120 + i * 328} y="104" width="304" height="128" rx="16" fill={M.surface} stroke={M.line} />
          <text x={144 + i * 328} y="134" fontFamily={MONO} fontSize="9.5" letterSpacing="1.6" fill={M.text}>
            {kpi.label}
          </text>
          <text
            x={144 + i * 328}
            y="182"
            fontFamily={SANS}
            fontSize="30"
            fontWeight="500"
            letterSpacing="-1"
            fill={M.ink}
          >
            {kpi.value}
          </text>
          <text x={144 + i * 328} y="208" fontFamily={MONO} fontSize="10" fill={M.text}>
            {kpi.delta} vs. trimestre
          </text>
          <g transform={`translate(${296 + i * 328}, 150)`}>
            <motion.path
              d={kpi.spark}
              stroke={M.ink}
              strokeOpacity="0.45"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </g>
        </motion.g>
      ))}

      {/* main chart */}
      <motion.g {...pop(0.2)}>
        <rect x="120" y="260" width="640" height="292" rx="16" fill={M.surface} stroke={M.line} />
        <text x="144" y="294" fontFamily={SANS} fontSize="13.5" fontWeight="500" fill={M.ink}>
          Flujo de caja
        </text>
        <text x="700" y="294" textAnchor="end" fontFamily={MONO} fontSize="10" fill={M.text}>
          12 MESES
        </text>
        {[340, 388, 436, 484].map((y) => (
          <path key={y} d={`M152 ${y}h576`} stroke={M.line} strokeDasharray="2 5" />
        ))}
        <path d="M152 500h576" stroke={M.line} />

        <motion.path
          d={`${CHART_LINE}L728 500H152Z`}
          fill="url(#mrd-area)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.path
          d={CHART_LINE}
          stroke={M.ink}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        {MONTHS.map((month, i) => (
          <text
            key={month}
            x={158 + i * 52}
            y="522"
            fontFamily={MONO}
            fontSize="8"
            fill={M.mid}
            letterSpacing="0.6"
          >
            {month}
          </text>
        ))}

        <motion.g {...pop(1.1)}>
          <path d="M540 356v144" stroke={M.ink} strokeOpacity="0.2" strokeDasharray="3 3" />
          <circle cx="540" cy="356" r="5" fill={M.ink} />
          <circle cx="540" cy="356" r="10" fill={M.ink} fillOpacity="0.1" />
          <rect x="482" y="300" width="116" height="44" rx="10" fill={M.ink} />
          <text x="496" y="320" fontFamily={MONO} fontSize="8.5" fill={M.onInk} fillOpacity="0.55">
            SEPTIEMBRE
          </text>
          <text x="496" y="336" fontFamily={SANS} fontSize="13" fontWeight="500" fill={M.onInk}>
            € 61 420
          </text>
        </motion.g>
      </motion.g>

      {/* activity list */}
      <motion.g {...pop(0.28)}>
        <rect x="784" y="260" width="296" height="292" rx="16" fill={M.surface} stroke={M.line} />
        <text x="808" y="294" fontFamily={SANS} fontSize="13.5" fontWeight="500" fill={M.ink}>
          Movimientos
        </text>
        {ROWS.map((row, i) => (
          <g key={row.code} transform={`translate(0, ${i * 56})`}>
            <circle cx="822" cy="336" r="12" fill={M.soft} />
            <rect x="844" y="328" width={row.name} height="6" rx="3" fill={M.soft} />
            <text x="844" y="350" fontFamily={MONO} fontSize="8.5" fill={M.mid}>
              {row.code}
            </text>
            <text x="1056" y="340" textAnchor="end" fontFamily={MONO} fontSize="10.5" fill={M.ink}>
              {row.amount}
            </text>
            {i < ROWS.length - 1 ? <path d="M808 364h248" stroke={M.line} /> : null}
          </g>
        ))}
      </motion.g>

      {/* table */}
      <motion.g {...pop(0.36)}>
        <rect x="120" y="576" width="960" height="138" rx="16" fill={M.surface} stroke={M.line} />
        <path d="M120 616h960" stroke={M.line} />
        {["CUENTA", "ESTADO", "ÚLTIMO CIERRE", "VARIACIÓN"].map((head, i) => (
          <text
            key={head}
            x={148 + i * 232}
            y="602"
            fontFamily={MONO}
            fontSize="9"
            letterSpacing="1.4"
            fill={M.text}
          >
            {head}
          </text>
        ))}
        {[0, 1].map((r) => (
          <g key={r} transform={`translate(0, ${r * 48})`}>
            <rect x="148" y="640" width={136 - r * 28} height="7" rx="3.5" fill={M.soft} />
            <rect x="380" y="637" width="72" height="14" rx="7" fill={r === 0 ? M.ink : M.soft} />
            <rect x="612" y="640" width="88" height="7" rx="3.5" fill={M.soft} />
            <rect x="844" y="640" width={r === 0 ? 104 : 64} height="7" rx="3.5" fill={M.soft} />
            {r === 0 ? <path d="M120 664h960" stroke={M.line} /> : null}
          </g>
        ))}
      </motion.g>
    </svg>
  );
}
