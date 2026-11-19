// 把 src/content/about.md 的簡易標記轉成頁面用的資料。
// 規則說明寫在 about.md 檔案開頭。設計原則：任何無法辨識的寫法都當成一般段落，不會讓網站壞掉。

export type Block =
  | { type: 'p'; text: string }
  | { type: 'pull'; text: string }
  | { type: 'close'; text: string }
  | { type: 'whisper'; lines: string[] }
  | { type: 'center'; lines: string[] }
  | { type: 'cards'; items: { name: string; desc: string }[] };

export interface Principle { no: string; title: string; sub: string; blocks: Block[] }
export interface About {
  title: string;
  lead: string;
  intro: Block[];
  principles: Principle[];
  closing: { title: string; mottos: string[]; text: string[] } | null;
}

const strip = (s: string) => s.replace(/\*\*/g, '').trim();

function addBlock(blocks: Block[], line: string) {
  const last = blocks[blocks.length - 1];
  if (line.startsWith('!! ')) return blocks.push({ type: 'close', text: line.slice(3).trim() });
  if (line.startsWith('>> ')) return blocks.push({ type: 'pull', text: line.slice(3).trim() });
  if (line.startsWith('^^ ')) {
    const text = line.slice(3).trim();
    if (last?.type === 'center') last.lines.push(text);
    else blocks.push({ type: 'center', lines: [text] });
    return;
  }
  if (line.startsWith('* ')) {
    const text = line.slice(2).trim();
    if (last?.type === 'whisper') last.lines.push(text);
    else blocks.push({ type: 'whisper', lines: [text] });
    return;
  }
  if (line.startsWith('- ')) {
    const body = line.slice(2);
    const m = body.match(/^(.+?)[：:]\s*(.*)$/);
    const item = m ? { name: strip(m[1]), desc: m[2].trim() } : { name: strip(body), desc: '' };
    if (last?.type === 'cards') last.items.push(item);
    else blocks.push({ type: 'cards', items: [item] });
    return;
  }
  blocks.push({ type: 'p', text: line.replace(/^>\s*/, '').trim() });
}

export function parseAbout(raw: string): About {
  const text = raw.replace(/<!--[\s\S]*?-->/g, '');
  const about: About = { title: '', lead: '', intro: [], principles: [], closing: null };
  let mode: 'intro' | 'principle' | 'closing' = 'intro';

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^#\s/.test(line)) { about.title = line.slice(2).trim(); continue; }

    if (/^##\s/.test(line)) {
      const heading = line.slice(3).trim();
      if (heading === '結語') {
        mode = 'closing';
        about.closing = { title: '', mottos: [], text: [] };
      } else {
        const m = heading.match(/^(\S+?)\s*[｜|]\s*(.+)$/);
        about.principles.push({ no: m ? m[1] : '', title: m ? m[2] : heading, sub: '', blocks: [] });
        mode = 'principle';
      }
      continue;
    }

    if (mode === 'closing' && about.closing) {
      const c = about.closing;
      if (line.startsWith('>> ')) c.mottos.push(line.slice(3).trim());
      else if (line.startsWith('> ') && !c.title) c.title = line.slice(2).trim();
      else c.text.push(line.replace(/^[>!*-]+\s*/, ''));
      continue;
    }

    if (mode === 'principle') {
      const p = about.principles[about.principles.length - 1];
      if (line.startsWith('> ') && !line.startsWith('>> ') && !p.sub && p.blocks.length === 0) {
        p.sub = line.slice(2).trim();
      } else addBlock(p.blocks, line);
      continue;
    }

    // intro
    if (line.startsWith('> ') && !line.startsWith('>> ') && !about.lead && about.intro.length === 0) {
      about.lead = line.slice(2).trim();
    } else addBlock(about.intro, line);
  }
  return about;
}
