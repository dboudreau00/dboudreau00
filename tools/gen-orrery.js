// Generates assets/dark-orrery.svg for the dboudreau00 profile README.
// Faithful to dboudreau.dev dark.html: palette, 13 bodies innermost-first,
// tones gold/pale/cool, T ~ a^1.5, inclined disk, quiet rings.

const W = 840, H = 420, CX = 420, CY = 218, TILT = 0.45;

const COL = {
  bg: "#04050a", bgWarm: "#0a0906",
  goldPale: "#f5e6b8", gold: "#e3c46b", goldRich: "#c9a227", goldDeep: "#8c6d1f",
  white: "#ffffff", whiteCool: "#eef1ff",
};
const TONE = { gold: COL.gold, pale: COL.goldPale, cool: COL.whiteCool };

// orbit order, innermost first — mirrors PROJECTS in dark.html
const BODIES = [
  { name: "NocTORnal", tone: "pale" },
  { name: "ProxiMight", tone: "gold" },
  { name: "AuthorItMe", tone: "cool" },
  { name: "Conformiti", tone: "pale" },
  { name: "XaultWallet", tone: "gold" },
  { name: "Googlook", tone: "cool" },
  { name: "Process Shield", tone: "pale" },
  { name: "Countersign", tone: "gold" },
  { name: "AppLockVault", tone: "cool" },
  { name: "Delpheed", tone: "pale" },
  { name: "AFK-AFrickinKiller", tone: "gold" },
  { name: "VeraCrypt DCS Duress", tone: "cool" },
  { name: "GoWAF", tone: "pale" },
];

// seeded PRNG so the sky is stable across regenerations
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(0xD0B0);

const r2 = (n) => Math.round(n * 100) / 100;
let out = [];

out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Georgia,'Times New Roman',serif" role="img" aria-label="The Dark Orrery — thirteen projects orbiting one core">`);
out.push(`<defs>
<radialGradient id="bg" cx="50%" cy="46%" r="75%">
  <stop offset="0%" stop-color="${COL.bgWarm}"/>
  <stop offset="55%" stop-color="${COL.bg}"/>
  <stop offset="100%" stop-color="#000000"/>
</radialGradient>
<radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stop-color="#fff6e2" stop-opacity=".85"/>
  <stop offset="28%" stop-color="${COL.gold}" stop-opacity=".38"/>
  <stop offset="70%" stop-color="${COL.goldRich}" stop-opacity=".10"/>
  <stop offset="100%" stop-color="${COL.goldRich}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="core" cx="42%" cy="40%" r="65%">
  <stop offset="0%" stop-color="${COL.white}"/>
  <stop offset="45%" stop-color="#fff2cf"/>
  <stop offset="100%" stop-color="${COL.gold}"/>
</radialGradient>
<radialGradient id="vig" cx="50%" cy="48%" r="72%">
  <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
  <stop offset="100%" stop-color="#000000" stop-opacity=".5"/>
</radialGradient>
</defs>`);

out.push(`<rect width="${W}" height="${H}" rx="12" fill="url(#bg)"/>`);

// ---- stars ----
let stars = [];
for (let i = 0; i < 96; i++) {
  const x = r2(10 + rand() * (W - 20));
  const y = r2(10 + rand() * (H - 20));
  const r = r2(0.4 + rand() * 0.8);
  const o = r2(0.15 + rand() * 0.55);
  const fill = rand() < 0.3 ? COL.goldPale : COL.white;
  if (i % 8 === 0) {
    const dur = r2(3 + rand() * 5);
    const beg = r2(-rand() * dur);
    stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${o}"><animate attributeName="opacity" values="${o};${r2(o * 0.25)};${o}" dur="${dur}s" begin="${beg}s" repeatCount="indefinite"/></circle>`);
  } else {
    stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${o}"/>`);
  }
}
out.push(`<g>${stars.join("")}</g>`);

// ---- orbit rings (present, not shouty) ----
let rings = [];
const RX = (i) => 60 + i * (325 / 12); // 60 .. 385
for (let i = 0; i < 13; i++) {
  const rx = r2(RX(i)), ry = r2(RX(i) * TILT);
  rings.push(`<ellipse cx="${CX}" cy="${CY}" rx="${rx}" ry="${ry}" fill="none" stroke="${COL.gold}" stroke-opacity="${i === 0 ? 0.16 : 0.11}" stroke-width="1"/>`);
}
out.push(`<g>${rings.join("")}</g>`);

// ---- the core ----
out.push(`<g>
<circle cx="${CX}" cy="${CY}" r="52" fill="url(#coreGlow)">
  <animate attributeName="opacity" values=".75;1;.75" dur="7s" repeatCount="indefinite"/>
</circle>
<circle cx="${CX}" cy="${CY}" r="7.5" fill="url(#core)"/>
<circle cx="${CX}" cy="${CY}" r="11" fill="none" stroke="${COL.goldPale}" stroke-opacity=".28" stroke-width=".7"/>
</g>`);

// ---- thirteen bodies on Keplerian rails ----
let bodies = [];
for (let i = 0; i < 13; i++) {
  const rx = r2(RX(i)), ry = r2(RX(i) * TILT);
  const T = r2(14 * Math.pow(RX(i) / 60, 1.5));
  const frac = (i * 0.61803) % 1;
  const beg = r2(-T * frac);
  const tone = TONE[BODIES[i].tone];
  const br = r2(2.6 + rand() * 1.5);
  const path = `M ${r2(CX + rx)} ${CY} A ${rx} ${ry} 0 1 1 ${r2(CX - rx)} ${CY} A ${rx} ${ry} 0 1 1 ${r2(CX + rx)} ${CY} Z`;
  bodies.push(`<g>
  <animateMotion dur="${T}s" begin="${beg}s" repeatCount="indefinite" path="${path}"/>
  <circle r="${r2(br * 2.6)}" fill="${tone}" opacity=".14"/>
  <circle r="${br}" fill="${tone}"/>
  <circle r="${r2(br * 0.45)}" cx="${r2(-br * 0.25)}" cy="${r2(-br * 0.25)}" fill="${COL.white}" opacity=".5"/>
</g>`);
}
out.push(bodies.join("\n"));

out.push(`<rect width="${W}" height="${H}" rx="12" fill="url(#vig)" pointer-events="none"/>`);

// ---- inscriptions ----
const MONO = `ui-monospace,'Cascadia Code',Consolas,Menlo,monospace`;
out.push(`<text x="${CX}" y="34" text-anchor="middle" fill="${COL.goldPale}" opacity=".85" font-size="15" letter-spacing="7">THE DARK ORRERY</text>`);
out.push(`<text x="18" y="${H - 14}" fill="${COL.goldPale}" opacity=".45" font-size="9" letter-spacing="1.5" font-family="${MONO}">13 bodies · orbital</text>`);
out.push(`<text x="${W - 18}" y="${H - 14}" text-anchor="end" fill="${COL.gold}" opacity=".6" font-size="9" letter-spacing="1.5" font-family="${MONO}">dboudreau.dev ⟶</text>`);

out.push(`</svg>`);

require("fs").writeFileSync(process.argv[2], out.join("\n"), "utf8");
console.log("wrote", process.argv[2]);
