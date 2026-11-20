// 劇本資料來源：預約系統的 Google 試算表（scripts 分頁），透過 Apps Script 公開 API 讀取。
// 建置時（GitHub Actions）讀取一次；讀不到時改用 src/data/catalog.snapshot.json，網站不會因此壞掉或變空。
import type { Loader } from 'astro/loaders';
import snapshot from '../data/catalog.snapshot.json';

/** 預約系統 Apps Script 網址（公開，非密鑰；與 relaxstory/booking 的 frontend/.env 相同） */
export const CATALOG_URL =
  'https://script.google.com/macros/s/AKfycbyy32l2fuZzhnNkTf6Fn8Xz0shdCUTGDxpIsEinp0Q2gsn9zvRJS9Vsm1H3F_mcwIdpNw/exec?action=catalog';

/** API 回傳的一筆劇本（欄位說明見 relaxstory/booking 的 backend/src/Scripts.js） */
interface CatalogScript {
  id: string;
  name: string;
  site_status: '上架中' | '即將推出' | '隱藏';
  bookable: boolean;
  featured: boolean;
  sort_order: number | null;
  badge: '新上架' | '熱門' | null;
  tagline: string;
  genres: string[];
  players: number | null;
  duration_min: number | null;
  male: number | null;
  female: number | null;
  gender_advice: string;
  series: string;
  adapted: boolean;
  difficulty: number | null;
  hosts: string[];
  price: number | null;
  description: string;
  author?: string;
  features?: string[];
  suits?: string[];
  experience?: string;
  reading_load?: string;
  curator_note?: string;
}

/** 「1女1男」→「1 女 1 男」 */
const spaceCounts = (t: string) => t.replace(/(\d+)\s*([女男])\s*/g, '$1 $2 ').trim();

/** 角色配置：由男女人數推算；兩者皆空白 = 不限 */
function roles(s: CatalogScript): string {
  if (s.male === null && s.female === null) return '不限';
  const parts = [];
  if (s.female) parts.push(`${s.female} 女`);
  if (s.male) parts.push(`${s.male} 男`);
  return parts.join(' ') || '不限';
}

function duration(min: number | null): string {
  if (!min) return '';
  const h = Math.round((min / 60) * 10) / 10;
  return `約 ${h} 小時`;
}

/** 轉成網站頁面使用的欄位（與 content.config.ts 的 schema 對應） */
function toEntry(s: CatalogScript) {
  return {
    title: s.name,
    tagline: s.tagline,
    genre: s.genres,
    players: s.players ? `${s.players} 人` : '',
    roles: roles(s),
    genderAdvice: s.gender_advice ? spaceCounts(s.gender_advice) : undefined,
    duration: duration(s.duration_min),
    difficulty: s.difficulty ?? undefined,
    price: s.price === null ? undefined : `每人 NT$ ${s.price}`,
    series: s.series || undefined,
    badge: s.badge ?? undefined,
    adapted: s.adapted,
    featured: s.featured,
    status: s.site_status === '即將推出' ? '即將推出' : '上架中',
    bookable: s.bookable,
    hosts: s.hosts,
    order: s.sort_order ?? 999,
    description: s.description,
    author: s.author || undefined,
    features: s.features ?? [],
    suits: s.suits ?? [],
    experience: s.experience || undefined,
    readingLoad: s.reading_load || undefined,
    curatorNote: s.curator_note || undefined,
  };
}

async function fetchCatalog(): Promise<CatalogScript[]> {
  const res = await fetch(CATALOG_URL, { signal: AbortSignal.timeout(30_000), redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { ok: boolean; scripts?: CatalogScript[]; error?: string };
  if (!body.ok) throw new Error(`API 回傳錯誤：${body.error}`);
  if (!body.scripts?.length) throw new Error('API 回傳 0 部劇本');
  return body.scripts;
}

export function catalogLoader(): Loader {
  return {
    name: 'relax-catalog',
    load: async ({ store, parseData, logger }) => {
      let scripts: CatalogScript[];
      try {
        scripts = await fetchCatalog();
        logger.info(`已從試算表讀取 ${scripts.length} 部劇本`);
      } catch (err) {
        const msg = `讀不到試算表劇本目錄（${(err as Error).message}），改用 src/data/catalog.snapshot.json`;
        logger.warn(msg);
        if (process.env.GITHUB_ACTIONS) console.log(`::warning title=劇本目錄::${msg}`);
        scripts = (snapshot as { scripts: CatalogScript[] }).scripts;
      }
      store.clear();
      for (const s of scripts) {
        if (!s.id || !s.name || s.site_status === '隱藏') continue;
        const data = await parseData({ id: s.id, data: toEntry(s) });
        store.set({ id: s.id, data });
      }
    },
  };
}
