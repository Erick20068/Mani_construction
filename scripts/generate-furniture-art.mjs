// opencode enciende el taller
/**
 * Generador de ilustraciones de muebles en SVG (sin coste, sin APIs).
 *   node scripts/generate-furniture-art.mjs
 * Salida: public/furniture/*.svg
 *
 * Estilo: ilustracion de producto con luz suave, madera con veta
 * y sombra proyectada, en la paleta de Maderas & Diseno.
 */

import fs from "node:fs"
import path from "node:path"

const OUT = path.join(process.cwd(), "public", "furniture")
fs.mkdirSync(OUT, { recursive: true })

/* ---------------------------------------------------------------- */
/* Paleta de maderas                                                  */
/* ---------------------------------------------------------------- */
const WOODS = {
  roble: { light: "#C8A165", mid: "#A97B42", dark: "#7C5629", grain: "#8A6132" },
  nogal: { light: "#8B5E3C", mid: "#6B4529", dark: "#4A2F1C", grain: "#5C3A22" },
  cedar: { light: "#D7B183", mid: "#B98F5C", dark: "#8E6839", grain: "#A67C48" },
  cerezo: { light: "#D8A184", mid: "#BC7D5E", dark: "#94573C", grain: "#A96B4C" },
  fresno: { light: "#E3CBA5", mid: "#C6A876", dark: "#9A7E4F", grain: "#B08F5E" },
  teka: { light: "#B08355", mid: "#8C6240", dark: "#66432A", grain: "#7C5537" },
  pino: { light: "#E9CE9E", mid: "#D2AE76", dark: "#A88752", grain: "#BE995F" },
  caoba: { light: "#9E5B3C", mid: "#7E412A", dark: "#5A2C1B", grain: "#6E3B26" },
}

const LINEN = { light: "#E8E0D2", mid: "#D6CBBB", dark: "#B8AB99" }
const METAL = { light: "#5A6273", mid: "#39404F", dark: "#20242E" }

/* ---------------------------------------------------------------- */
/* Helpers de SVG                                                     */
/* ---------------------------------------------------------------- */

function defs(w, id) {
  return `
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="60%" stop-color="#F1EBE1"/>
      <stop offset="100%" stop-color="#E5DDD0"/>
    </linearGradient>

    <linearGradient id="wood-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${w.light}"/>
      <stop offset="55%" stop-color="${w.mid}"/>
      <stop offset="100%" stop-color="${w.dark}"/>
    </linearGradient>

    <linearGradient id="wood-h-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${w.light}"/>
      <stop offset="50%" stop-color="${w.mid}"/>
      <stop offset="100%" stop-color="${w.dark}"/>
    </linearGradient>

    <linearGradient id="wood-t-${id}" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0%" stop-color="${w.light}"/>
      <stop offset="70%" stop-color="${w.mid}"/>
      <stop offset="100%" stop-color="${w.dark}"/>
    </linearGradient>

    <linearGradient id="linen-${id}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${LINEN.light}"/>
      <stop offset="100%" stop-color="${LINEN.dark}"/>
    </linearGradient>

    <linearGradient id="metal-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${METAL.light}"/>
      <stop offset="45%" stop-color="${METAL.mid}"/>
      <stop offset="100%" stop-color="${METAL.dark}"/>
    </linearGradient>

    <radialGradient id="spot-${id}" cx="0.42" cy="0.28" r="0.75">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <filter id="grain-${id}" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.035" numOctaves="4" seed="7" result="t"/>
      <feColorMatrix in="t" type="saturate" values="0" result="g"/>
      <feComponentTransfer in="g" result="g2">
        <feFuncA type="linear" slope="0.16"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="g2" mode="multiply"/>
    </filter>

    <filter id="soft-${id}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>

    <filter id="blur-sm-${id}" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>

    <filter id="drop-${id}" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#4A3A28" flood-opacity="0.24"/>
    </filter>
  </defs>`
}

function frame(id, inner, { w = 1200, h = 1200 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  ${defs(WOODS.roble, id)}
  <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
  <rect width="${w}" height="${h}" fill="url(#spot-${id})"/>
  <g>${inner}</g>
</svg>`
}

const floorShadow = (id, cx, cy, rx, ry, op = 0.3) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#6B543A" opacity="${op}" filter="url(#blur-sm-${id})"/>`

/* ---------------------------------------------------------------- */
/* Piezas de mobiliario                                               */
/* ---------------------------------------------------------------- */

const pieces = {
  /* --- Sofá modular --- */
  "sofa-modular-roble": (id, w) => `
    ${floorShadow(id, 600, 880, 400, 52, 0.32)}
    <g filter="url(#drop-${id})">
      <!-- respaldo -->
      <rect x="250" y="440" width="700" height="200" rx="26" fill="url(#wood-${id})"/>
      <rect x="250" y="440" width="700" height="200" rx="26" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <!-- cojines de respaldo -->
      <rect x="278" y="392" width="200" height="140" rx="20" fill="url(#linen-${id})"/>
      <rect x="490" y="392" width="200" height="140" rx="20" fill="url(#linen-${id})"/>
      <rect x="702" y="392" width="200" height="140" rx="20" fill="url(#linen-${id})"/>
      <!-- brazos -->
      <rect x="206" y="470" width="72" height="230" rx="22" fill="url(#wood-t-${id})"/>
      <rect x="922" y="470" width="72" height="230" rx="22" fill="url(#wood-t-${id})"/>
      <!-- asiento -->
      <rect x="258" y="620" width="684" height="110" rx="24" fill="url(#linen-${id})"/>
      <rect x="258" y="620" width="684" height="110" rx="24" fill="url(#wood-${id})" opacity="0.05"/>
      <line x1="486" y1="628" x2="486" y2="722" stroke="${LINEN.dark}" stroke-width="2" opacity="0.6"/>
      <line x1="714" y1="628" x2="714" y2="722" stroke="${LINEN.dark}" stroke-width="2" opacity="0.6"/>
      <!-- base -->
      <rect x="270" y="730" width="660" height="46" rx="12" fill="url(#wood-${id})"/>
      <rect x="270" y="730" width="660" height="46" rx="12" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
    </g>
    <!-- patas metalicas -->
    <rect x="292" y="776" width="18" height="76" rx="6" fill="url(#metal-${id})"/>
    <rect x="890" y="776" width="18" height="76" rx="6" fill="url(#metal-${id})"/>
    <!-- manta decorativa -->
    <path d="M760 400 L920 400 L900 470 L775 470 Z" fill="${w.grain}" opacity="0.5"/>
  `,

  /* --- Mesa de comedor --- */
  "mesa-comedor-nogal": (id, w) => `
    ${floorShadow(id, 600, 900, 420, 46, 0.3)}
    <g filter="url(#drop-${id})">
      <!-- tablero -->
      <path d="M180 520 L1020 520 L940 470 L260 470 Z" fill="url(#wood-t-${id})"/>
      <path d="M180 520 L1020 520 L940 470 L260 470 Z" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>
      <path d="M180 520 L1020 520 L1020 548 L180 548 Z" fill="${w.dark}"/>
      <!-- patas -->
      <rect x="240" y="548" width="34" height="352" rx="8" fill="url(#wood-${id})"/>
      <rect x="926" y="548" width="34" height="352" rx="8" fill="url(#wood-${id})"/>
      <rect x="586" y="548" width="30" height="352" rx="8" fill="url(#wood-${id})" opacity="0.9"/>
      <rect x="240" y="548" width="34" height="352" rx="8" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <rect x="926" y="548" width="34" height="352" rx="8" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
    </g>
    <!-- sillas -->
    ${[300, 470, 640, 810]
      .map(
        (x) => `
      <g opacity="0.96">
        <rect x="${x - 46}" y="330" width="92" height="150" rx="14" fill="url(#wood-${id})"/>
        <rect x="${x - 46}" y="330" width="92" height="150" rx="14" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
        <rect x="${x - 52}" y="470" width="104" height="22" rx="9" fill="url(#linen-${id})"/>
        <rect x="${x - 40}" y="492" width="12" height="92" rx="5" fill="url(#wood-${id})"/>
        <rect x="${x + 28}" y="492" width="12" height="92" rx="5" fill="url(#wood-${id})"/>
      </g>`
      )
      .join("")}
  `,

  /* --- Cama --- */
  "cama-cabecero-cedro": (id, w) => `
    ${floorShadow(id, 600, 900, 430, 44, 0.28)}
    <g filter="url(#drop-${id})">
      <!-- cabecero listones -->
      ${Array.from({ length: 11 })
        .map(
          (_, i) =>
            `<rect x="${248 + i * 64}" y="300" width="40" height="300" rx="12" fill="url(#wood-${id})"/>`
        )
        .join("")}
      ${Array.from({ length: 11 })
        .map(
          (_, i) =>
            `<rect x="${248 + i * 64}" y="300" width="40" height="300" rx="12" fill="url(#wood-${id})" filter="url(#grain-${id})"/>`
        )
        .join("")}
      <!-- base -->
      <rect x="230" y="640" width="740" height="180" rx="18" fill="url(#wood-${id})"/>
      <!-- colchon -->
      <rect x="252" y="596" width="696" height="70" rx="20" fill="url(#linen-${id})"/>
      <!-- mantel -->
      <path d="M252 640 L948 640 L948 800 Q600 836 252 800 Z" fill="url(#linen-${id})"/>
      <path d="M252 640 L948 640 L948 800 Q600 836 252 800 Z" fill="${w.grain}" opacity="0.16"/>
      <!-- almohadas -->
      <rect x="300" y="516" width="170" height="90" rx="22" fill="#F3EDE3"/>
      <rect x="492" y="516" width="170" height="90" rx="22" fill="#F3EDE3"/>
      <rect x="684" y="516" width="170" height="90" rx="22" fill="#F3EDE3"/>
    </g>
    <rect x="250" y="820" width="22" height="66" rx="7" fill="url(#wood-${id})"/>
    <rect x="928" y="820" width="22" height="66" rx="7" fill="url(#wood-${id})"/>
  `,

  /* --- Escritorio --- */
  "escritorio-cerezo": (id, w) => `
    ${floorShadow(id, 600, 890, 390, 44, 0.3)}
    <g filter="url(#drop-${id})">
      <rect x="210" y="480" width="780" height="34" rx="10" fill="url(#wood-t-${id})"/>
      <rect x="210" y="480" width="780" height="34" rx="10" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>
      <rect x="210" y="514" width="780" height="12" rx="5" fill="${w.dark}"/>
      <!-- cajonera -->
      <rect x="700" y="526" width="270" height="280" rx="12" fill="url(#wood-${id})"/>
      <rect x="700" y="526" width="270" height="280" rx="12" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <line x1="700" y1="620" x2="970" y2="620" stroke="${w.dark}" stroke-width="3" opacity="0.65"/>
      <line x1="700" y1="712" x2="970" y2="712" stroke="${w.dark}" stroke-width="3" opacity="0.65"/>
      <circle cx="835" cy="573" r="9" fill="url(#metal-${id})"/>
      <circle cx="835" cy="666" r="9" fill="url(#metal-${id})"/>
      <circle cx="835" cy="758" r="9" fill="url(#metal-${id})"/>
      <!-- patas -->
      <rect x="230" y="526" width="26" height="340" rx="8" fill="url(#wood-${id})"/>
      <rect x="944" y="526" width="26" height="340" rx="8" fill="url(#wood-${id})"/>
      <rect x="230" y="526" width="26" height="340" rx="8" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <rect x="944" y="526" width="26" height="340" rx="8" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
    </g>
    <!-- monitor -->
    <rect x="380" y="330" width="250" height="150" rx="10" fill="${METAL.dark}"/>
    <rect x="392" y="342" width="226" height="126" rx="6" fill="#243247"/>
    <rect x="488" y="480" width="34" height="14" fill="${METAL.mid}"/>
    <rect x="440" y="494" width="130" height="12" rx="6" fill="${METAL.mid}"/>
    <!-- teclado -->
    <rect x="404" y="446" width="200" height="14" rx="6" fill="${METAL.light}" opacity="0.35"/>
  `,

  /* --- Silla --- */
  "silla-fresno-rejilla": (id, w) => `
    ${floorShadow(id, 600, 900, 240, 40, 0.3)}
    <g filter="url(#drop-${id})">
      <!-- respaldo -->
      <rect x="482" y="250" width="236" height="300" rx="18" fill="url(#wood-${id})"/>
      <rect x="482" y="250" width="236" height="300" rx="18" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <!-- rejilla de cordón -->
      ${Array.from({ length: 5 })
        .map(
          (_, i) =>
            `<rect x="506" y="${300 + i * 46}" width="188" height="16" rx="8" fill="${LINEN.dark}" opacity="0.85"/>`
        )
        .join("")}
      <!-- asiento -->
      <rect x="450" y="556" width="300" height="46" rx="16" fill="url(#wood-t-${id})"/>
      <rect x="466" y="602" width="268" height="34" rx="14" fill="url(#linen-${id})"/>
      <!-- patas -->
      <rect x="486" y="636" width="24" height="240" rx="9" fill="url(#wood-${id})"/>
      <rect x="690" y="636" width="24" height="240" rx="9" fill="url(#wood-${id})"/>
      <rect x="486" y="636" width="24" height="240" rx="9" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <rect x="690" y="636" width="24" height="240" rx="9" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <!-- travesano -->
      <rect x="486" y="780" width="228" height="16" rx="8" fill="${w.dark}"/>
    </g>
  `,

  /* --- Armario --- */
  "armario-teka-espejo": (id, w) => `
    ${floorShadow(id, 600, 900, 380, 42, 0.3)}
    <g filter="url(#drop-${id})">
      <rect x="270" y="250" width="660" height="620" rx="14" fill="url(#wood-${id})"/>
      <rect x="270" y="250" width="660" height="620" rx="14" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <!-- puertas -->
      <rect x="296" y="278" width="196" height="564" rx="8" fill="url(#wood-t-${id})"/>
      <rect x="502" y="278" width="196" height="564" rx="8" fill="#C9D6DE"/>
      <rect x="502" y="278" width="196" height="564" rx="8" fill="url(#bg-${id})" opacity="0.35"/>
      <rect x="708" y="278" width="196" height="564" rx="8" fill="url(#wood-t-${id})"/>
      <!-- tiradores bronce -->
      <rect x="476" y="540" width="12" height="110" rx="6" fill="#B08A4E"/>
      <rect x="712" y="540" width="12" height="110" rx="6" fill="#B08A4E"/>
    </g>
    <rect x="290" y="870" width="20" height="40" rx="6" fill="${w.dark}"/>
    <rect x="890" y="870" width="20" height="40" rx="6" fill="${w.dark}"/>
  `,

  /* --- Estantería --- */
  "estanteria-pino-modular": (id, w) => `
    ${floorShadow(id, 600, 900, 350, 40, 0.28)}
    <g filter="url(#drop-${id})">
      <rect x="270" y="220" width="120" height="650" rx="8" fill="url(#wood-${id})"/>
      <rect x="810" y="220" width="120" height="650" rx="8" fill="url(#wood-${id})"/>
      <rect x="270" y="220" width="120" height="650" rx="8" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <rect x="810" y="220" width="120" height="650" rx="8" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      ${[0, 1, 2, 3, 4]
        .map(
          (i) => `
        <rect x="270" y="${250 + i * 126}" width="660" height="26" rx="6" fill="url(#wood-t-${id})"/>
        <rect x="270" y="${250 + i * 126}" width="660" height="26" rx="6" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>`
        )
        .join("")}
    </g>
    <!-- libros -->
    ${[
      [320, 1, 34, "#8C4A3F"],
      [358, 1, 26, "#3E5C6B"],
      [388, 1, 30, "#6B7A4A"],
      [640, 2, 40, "#7A5C86"],
      [686, 2, 28, "#B08A4E"],
      [350, 3, 30, "#4A5E7A"],
      [386, 3, 34, "#7E5A3C"],
      [660, 3, 32, "#5A7A62"],
    ]
      .map(
        ([x, s, bw, c]) =>
          `<rect x="${x}" y="${250 + s * 126 - 8 - 78}" width="${bw}" height="78" rx="4" fill="${c}"/>`
      )
      .join("")}
  `,

  /* --- Mesa de centro --- */
  "mesa-centro-caoba": (id, w) => `
    ${floorShadow(id, 600, 880, 250, 40, 0.3)}
    <g filter="url(#drop-${id})">
      <ellipse cx="600" cy="530" rx="300" ry="105" fill="url(#wood-t-${id})"/>
      <ellipse cx="600" cy="530" rx="300" ry="105" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>
      <ellipse cx="600" cy="548" rx="300" ry="105" fill="${w.dark}" opacity="0.85"/>
      <!-- trípode -->
      <path d="M470 560 L520 560 L600 860 L470 860 Z" fill="url(#wood-${id})"/>
      <path d="M680 560 L730 560 L640 860 L520 860 Z" fill="url(#wood-${id})"/>
      <rect x="580" y="560" width="40" height="300" rx="10" fill="url(#wood-${id})"/>
    </g>
    <!-- objeto decorativo -->
    <ellipse cx="600" cy="452" rx="46" ry="16" fill="${w.dark}" opacity="0.9"/>
    <rect x="576" y="416" width="48" height="40" rx="8" fill="${w.grain}"/>
  `,

  /* --- Banco / perchero --- */
  "banco-perchero-caoba": (id, w) => `
    ${floorShadow(id, 600, 890, 330, 38, 0.28)}
    <g filter="url(#drop-${id})">
      <rect x="300" y="540" width="600" height="34" rx="10" fill="url(#wood-t-${id})"/>
      <rect x="300" y="540" width="600" height="34" rx="10" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>
      <rect x="330" y="574" width="26" height="300" rx="9" fill="url(#wood-${id})"/>
      <rect x="844" y="574" width="26" height="300" rx="9" fill="url(#wood-${id})"/>
      <rect x="330" y="574" width="26" height="300" rx="9" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <rect x="844" y="574" width="26" height="300" rx="9" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <!-- respaldo -->
      <rect x="330" y="360" width="540" height="26" rx="10" fill="url(#wood-${id})"/>
      <rect x="360" y="386" width="18" height="156" rx="8" fill="url(#wood-${id})"/>
      <rect x="822" y="386" width="18" height="156" rx="8" fill="url(#wood-${id})"/>
    </g>
    <!-- colgado -->
    <path d="M470 400 L520 400 L512 520 L478 520 Z" fill="${LINEN.dark}" opacity="0.9"/>
    <path d="M600 400 L650 400 L642 500 L608 500 Z" fill="#8C6A4E" opacity="0.85"/>
  `,

  /* --- Comedor completo --- */
  "comedor-completo-8": (id, w) => `
    ${floorShadow(id, 600, 910, 460, 46, 0.3)}
    <g filter="url(#drop-${id})">
      <path d="M230 540 L970 540 L900 492 L300 492 Z" fill="url(#wood-t-${id})"/>
      <path d="M230 540 L970 540 L900 492 L300 492 Z" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>
      <path d="M230 540 L970 540 L970 566 L230 566 Z" fill="${w.dark}"/>
      <rect x="290" y="566" width="32" height="330" rx="8" fill="url(#wood-${id})"/>
      <rect x="878" y="566" width="32" height="330" rx="8" fill="url(#wood-${id})"/>
      <rect x="586" y="566" width="28" height="330" rx="8" fill="url(#wood-${id})"/>
    </g>
    ${[
      [330, 330],
      [490, 330],
      [650, 330],
      [810, 330],
      [330, 596],
      [490, 596],
      [650, 596],
      [810, 596],
    ]
      .map(
        ([x, y]) => `
      <g opacity="0.97">
        <rect x="${x - 44}" y="${y}" width="88" height="132" rx="13" fill="url(#wood-${id})"/>
        <rect x="${x - 44}" y="${y}" width="88" height="132" rx="13" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
        <rect x="${x - 50}" y="${y + 128}" width="100" height="20" rx="9" fill="url(#linen-${id})"/>
      </g>`
      )
      .join("")}
  `,

  /* --- Piezas de proceso (galeria 3D) --- */
  "proceso-taller": (id, w) => `
    ${floorShadow(id, 600, 900, 400, 44, 0.28)}
    <g filter="url(#drop-${id})">
      <!-- banco de trabajo -->
      <rect x="180" y="620" width="840" height="46" rx="8" fill="url(#wood-t-${id})"/>
      <rect x="180" y="620" width="840" height="46" rx="8" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>
      <rect x="220" y="666" width="30" height="220" rx="8" fill="url(#wood-${id})"/>
      <rect x="950" y="666" width="30" height="220" rx="8" fill="url(#wood-${id})"/>
      <!-- tablones apilados -->
      <rect x="260" y="560" width="380" height="26" rx="5" fill="url(#wood-${id})"/>
      <rect x="280" y="534" width="340" height="26" rx="5" fill="${w.mid}"/>
      <rect x="300" y="508" width="300" height="26" rx="5" fill="${w.light}"/>
      <!-- herramientas -->
      <rect x="700" y="560" width="120" height="16" rx="8" fill="${METAL.light}"/>
      <rect x="836" y="548" width="16" height="44" rx="8" fill="${METAL.dark}"/>
    </g>
    <!-- sierra circular -->
    <circle cx="560" cy="380" r="130" fill="none" stroke="${METAL.mid}" stroke-width="22"/>
    <circle cx="560" cy="380" r="60" fill="none" stroke="${METAL.dark}" stroke-width="12"/>
    <path d="M560 250 L560 510 M430 380 L690 380" stroke="${METAL.dark}" stroke-width="10" opacity="0.5"/>
    <rect x="430" y="500" width="260" height="70" rx="10" fill="url(#metal-${id})"/>
  `,

  "proceso-ensamble": (id, w) => `
    ${floorShadow(id, 600, 890, 360, 40, 0.28)}
    <g filter="url(#drop-${id})">
      <!-- bastidor -->
      <rect x="300" y="420" width="600" height="34" rx="8" fill="url(#wood-${id})"/>
      <rect x="300" y="660" width="600" height="34" rx="8" fill="url(#wood-${id})"/>
      <rect x="300" y="420" width="34" height="274" rx="8" fill="url(#wood-${id})"/>
      <rect x="866" y="420" width="34" height="274" rx="8" fill="url(#wood-${id})"/>
      <rect x="300" y="420" width="600" height="34" rx="10" fill="url(#wood-${id})" filter="url(#grain-${id})"/>
      <!-- travesaños -->
      <rect x="430" y="454" width="26" height="206" fill="${w.mid}"/>
      <rect x="744" y="454" width="26" height="206" fill="${w.mid}"/>
      <!-- listo -->
      <rect x="500" y="300" width="200" height="120" rx="8" fill="url(#wood-t-${id})" opacity="0.9"/>
    </g>
    <!-- clavado -->
    <circle cx="612" cy="356" r="16" fill="${METAL.light}"/>
    <circle cx="662" cy="330" r="12" fill="${METAL.mid}"/>
  `,

  "proceso-acabado": (id, w) => `
    ${floorShadow(id, 600, 890, 340, 40, 0.26)}
    <g filter="url(#drop-${id})">
      <rect x="280" y="580" width="640" height="40" rx="8" fill="url(#wood-t-${id})"/>
      <rect x="280" y="580" width="640" height="40" rx="8" fill="url(#wood-t-${id})" filter="url(#grain-${id})"/>
      <rect x="320" y="620" width="26" height="250" rx="8" fill="url(#wood-${id})"/>
      <rect x="854" y="620" width="26" height="250" rx="8" fill="url(#wood-${id})"/>
    </g>
    <!-- lijadora -->
    <rect x="470" y="470" width="240" height="112" rx="18" fill="url(#metal-${id})"/>
    <rect x="500" y="440" width="110" height="42" rx="14" fill="${METAL.dark}"/>
    <circle cx="590" cy="596" r="46" fill="#C9B08A"/>
    <circle cx="590" cy="596" r="20" fill="${METAL.mid}"/>
    <!-- polvo -->
    ${Array.from({ length: 14 })
      .map(
        (_, i) =>
          `<circle cx="${420 + i * 28}" cy="${420 - (i % 5) * 26}" r="${6 + (i % 3) * 3}" fill="#C9B08A" opacity="0.4"/>`
      )
      .join("")}
  `,

  "proceso-cnc": (id, w) => `
    ${floorShadow(id, 600, 900, 380, 42, 0.28)}
    <g filter="url(#drop-${id})">
      <rect x="240" y="600" width="720" height="60" rx="10" fill="url(#metal-${id})"/>
      <rect x="240" y="600" width="720" height="60" rx="10" fill="url(#metal-${id})" filter="url(#grain-${id})"/>
      <rect x="300" y="660" width="40" height="230" rx="8" fill="${METAL.dark}"/>
      <rect x="860" y="660" width="40" height="230" rx="8" fill="${METAL.dark}"/>
    </g>
    <!-- cabezal -->
    <rect x="500" y="300" width="200" height="230" rx="14" fill="url(#metal-${id})"/>
    <rect x="530" y="340" width="140" height="90" rx="8" fill="${METAL.dark}"/>
    <rect x="586" y="530" width="28" height="70" rx="6" fill="${METAL.light}"/>
    <!-- panel -->
    <rect x="380" y="560" width="440" height="40" rx="6" fill="url(#wood-t-${id})"/>
    <!-- vias -->
    <circle cx="520" cy="600" r="18" fill="none" stroke="#5FD3C4" stroke-width="5" opacity="0.9"/>
    <circle cx="680" cy="600" r="18" fill="none" stroke="#5FD3C4" stroke-width="5" opacity="0.9"/>
  `,
}

/* ---------------------------------------------------------------- */
/* Generacion                                                         */
/* ---------------------------------------------------------------- */

let count = 0
for (const [name, draw] of Object.entries(pieces)) {
  const id = name.replace(/[^a-z]/gi, "")
  const woodName = Object.keys(WOODS).find((k) => name.includes(k)) || "roble"
  const w = WOODS[woodName]
  const svg = frame(id, draw(id, w))
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg, "utf8")
  count++
  console.log("  " + name + ".svg")
}

console.log(`\n${count} ilustraciones en ${OUT}`)
