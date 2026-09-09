import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { ASSET_PATHS } from "./asset-paths.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logosRoot = ASSET_PATHS.competitorLogos;

/** id → dominio para buscar logo */
const COMPETITORS = [
  ["minificando-ai", "minificando.ai"],
  ["calipso", "calipso.com"],
  ["ventasxmayor", "ventasxmayor.com.ar"],
  ["ecomm-app", "ecomm-app.com"],
  ["mesanube", "mesanube.ar"],
  ["ayres-it", "ayresit.ar"],
  ["redi-rediredi", "rediredi.com"],
  ["callbell-shop", "callbell.shop"],
  ["tiendanube", "tiendanube.com"],
  ["shopify", "shopify.com"],
  ["empretienda", "empretienda.com"],
  ["treinta", "treinta.co"],
  ["pedix", "pedix.app"],
  ["pency", "pency.app"],
  ["woocommerce", "woocommerce.com"],
  ["changuito", "changuito.ar"],
  ["dux", "duxsoftware.com.ar"],
  ["mercado-libre", "mercadolibre.com"],
  ["tiendli", "tiendli.com"],
  ["commercy", "commercy.com.ar"],
  ["wendo", "wendo.com.ar"],
  ["lapyme", "lapyme.com.ar"],
  ["dragonfish-zoo-logic", "zoologic.com.ar"],
  ["tango-software", "tango.software"],
  ["pistacho", "pistacho.app"],
  ["wix", "wix.com"],
  ["odoo", "odoo.com"],
  ["vtex", "vtex.com"],
  ["shoperly", "shoperly.app"],
  ["plenishop", "plenishop.com"],
  ["neolo", "neolo.com"],
  ["jumpseller", "jumpseller.com"],
  ["mitienda", "mitienda.uy"],
  ["prestashop", "prestashop.com"],
  ["bigcommerce", "bigcommerce.com"],
  ["bsale", "bsale.cl"],
  ["fenicio", "fenicio.io"],
  ["siigo", "siigo.com"],
  ["bootic", "bootic.com"],
  ["xcommerce", "xcommerce.cl"],
  ["take-app", "take.app"],
  ["alegra", "alegra.com"],
  ["baggo", "baggo.co"],
  ["tiendipy", "tiendipy.com"],
  ["comerciaya", "comerciaya.com"],
  ["webtana", "webtana.com"],
  ["nidux", "nidux.com"],
  ["qtiko", "qtiko.com"],
  ["blume", "madebyblume.com"],
  ["wstorecr", "wstorecr.com"],
  ["towami", "towami.com"],
  ["contifico-siigo", "siigo.com"],
  ["rocket-ec", "rocket.com.ec"],
  ["qpaypro", "qpaypro.com"],
  ["ecolatam", "ecolatam.com"],
  ["recurrente", "recurrente.com"],
  ["cuadra", "cuadra.com.gt"],
  ["vexo-os", "vexoos.com"],
  ["bind-erp", "bind.com.mx"],
  ["kioskito", "kioskito.app"],
  ["tiendy", "tiendy.com.py"],
  ["digital-shop-py", "digitalshop.com.py"],
  ["agilpedido", "agilpedido.com"],
  ["negocia-pe", "negocia.pe"],
  ["catalog-pe", "catalog.pe"],
  ["rocketfy", "rocketfy.com"],
  ["defontana", "defontana.com"],
  ["ucinema", "ucinema.com"],
  ["wishopai", "wishopai.com"],
  ["square-online", "squareup.com"],
  ["ecwid", "ecwid.com"],
  ["squarespace", "squarespace.com"],
  ["clover", "clover.com"],
  ["magento", "adobe.com"],
  ["godaddy-store", "godaddy.com"],
  ["vendabo", "vendabo.com"],
  ["digimart", "digimart.cloud"],
  ["tiendu", "tiendu.uy"],
  ["smart-business-uy", "smartbusiness.uy"],
  ["loyverse", "loyverse.com"],
  ["bold", "bold.co"],
  ["sicar", "sicar.mx"],
  ["kyte", "kyteapp.com"],
  ["fudo", "fu.do"],
  ["sap-business-one", "sap.com"],
  ["oracle-netsuite", "netsuite.com"],
  ["aspel", "aspel.com.mx"],
  ["tienda-negocio", "tiendanegocio.com"],
  ["xubio", "xubio.com"],
  ["vendty", "vendty.com"],
  ["toteat", "toteat.com"],
  ["colppy", "colppy.com"],
  ["eleventa", "eleventa.com"],
  ["cobrando-app", "cobrando.app"],
  ["contabilium", "contabilium.com"],
  ["loggro", "loggro.com"],
  ["maxirest", "maxirest.com"],
  ["venddy", "venddy.co"],
  ["key", "keyfacil.com"],
  ["niabit", "niabit.com.ar"],
  ["cataly", "cataly.io"],
  ["minitienda", "minitienda.co"],
  ["pedido-simple", "pedidosimple.com.ar"],
  ["mitienda24", "mitienda.la"],
  ["mercadily", "mercadily.com"],
  ["agencyrime", "agencyrime.com"],
  ["micatalogo-uno", "micatalogo.uno"],
];

async function fetchBuffer(url, options = {}) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MercantisStudio/1.0)",
        ...options.headers,
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) return null;
    if (type.includes("text/html")) return null;
    return { buf, type };
  } catch {
    return null;
  }
}

async function tryGoogleFavicon(domain) {
  return fetchBuffer(
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  );
}

async function tryDuckDuckGo(domain) {
  return fetchBuffer(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
}

async function trySiteIcon(domain) {
  const base = `https://${domain}`;
  const candidates = [
    `${base}/apple-touch-icon.png`,
    `${base}/apple-touch-icon-precomposed.png`,
    `${base}/favicon.ico`,
    `${base}/favicon.png`,
  ];
  for (const url of candidates) {
    const hit = await fetchBuffer(url);
    if (hit) return hit;
  }
  return null;
}

function extFromType(type, buf) {
  if (type.includes("svg")) return ".svg";
  if (type.includes("webp")) return ".webp";
  if (type.includes("png")) return ".png";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  if (type.includes("ico") || type.includes("octet-stream")) {
    if (buf[0] === 0x89 && buf[1] === 0x50) return ".png";
    return ".ico";
  }
  return ".png";
}

function toWebp(srcPath, destPath) {
  const r = spawnSync("sips", ["-s", "format", "webp", srcPath, "--out", destPath], {
    stdio: "pipe",
  });
  return r.status === 0;
}

async function saveLogo(id, domain) {
  const existing = [".webp", ".png", ".jpg", ".jpeg", ".svg"].find((ext) =>
    fs.existsSync(path.join(logosRoot, `${id}${ext}`)),
  );
  if (existing) {
    console.log(`  ✓ ${id} (ya existe)`);
    return true;
  }

  const sources = [
    () => trySiteIcon(domain),
    () => tryGoogleFavicon(domain),
    () => tryDuckDuckGo(domain),
  ];

  for (const source of sources) {
    const hit = await source();
    if (!hit) continue;

    const ext = extFromType(hit.type, hit.buf);
    const tmp = path.join(logosRoot, `${id}${ext}`);
    fs.mkdirSync(logosRoot, { recursive: true });
    fs.writeFileSync(tmp, hit.buf);

    const webpPath = path.join(logosRoot, `${id}.webp`);
    if (ext === ".webp") {
      console.log(`  ✓ ${id} (webp)`);
      return true;
    }
    if (ext === ".svg") {
      console.log(`  ✓ ${id} (svg)`);
      return true;
    }
    if (ext === ".ico") {
      const pngPath = path.join(logosRoot, `${id}.png`);
      if (toWebp(tmp, webpPath)) {
        fs.unlinkSync(tmp);
        console.log(`  ✓ ${id} (ico → webp)`);
        return true;
      }
      const r = spawnSync("sips", ["-s", "format", "png", tmp, "--out", pngPath], {
        stdio: "pipe",
      });
      fs.unlinkSync(tmp);
      if (r.status === 0) {
        console.log(`  ✓ ${id} (ico → png)`);
        return true;
      }
    }

    if (toWebp(tmp, webpPath)) {
      if (tmp !== webpPath && fs.existsSync(tmp)) fs.unlinkSync(tmp);
      console.log(`  ✓ ${id} (→ webp)`);
      return true;
    }

    console.log(`  ✓ ${id} (${ext})`);
    return true;
  }

  console.log(`  ✗ ${id} — sin logo para ${domain}`);
  return false;
}

async function main() {
  console.log("Descargando logos de competidores…\n");
  let ok = 0;
  for (const [id, domain] of COMPETITORS) {
    if (await saveLogo(id, domain)) ok++;
  }
  console.log(`\n${ok}/${COMPETITORS.length} logos listos.`);

  spawnSync("node", [path.join(root, "scripts/regenerate-competitor-logos.mjs")], {
    stdio: "inherit",
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
