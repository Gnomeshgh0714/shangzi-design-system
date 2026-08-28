#!/usr/bin/env node
/**
 * validate-deck.cjs · 上咨 deck P0 机械校验（零依赖）
 *
 * 用法：
 *   node scripts/validate-deck.cjs <deck.html> [--md <素材.md>]
 *
 * 校验项（对照 references/checklist.md P0）：
 *   ① 骨架：必含 #deck / #stage / .slide
 *   ② 禁色：旧参考 skill 暖三色 / 旧工作 prompt 蓝 / 纯黑页背景
 *   ③ 禁忌式样：backdrop-filter / bounce / 渐变文字 / 文本箭头
 *   ④ 裸标签：ul/ol/table/blockquote 必须带 class
 *   ⑤ 内容保真：素材 MD 每行/每格在 HTML 文本中可找到（覆盖率 ≥ 0.90，--md 时检查）
 *   ⑥ 编辑层：editable-layer 已注入
 * 警告项（不阻断）：品牌色值散落 :root 之外、emoji。
 *
 * exit 0 = P0 全过；exit 1 = 有 ✗。
 */

const fs = require('fs');

/* ---------- 参数 ---------- */
const argv = process.argv.slice(2);
if (!argv.length || argv[0] === '--help') {
  console.log('用法: node validate-deck.cjs <deck.html> [--md <素材.md>]');
  process.exit(argv.length ? 0 : 1);
}
const htmlPath = argv[0];
const mdIdx = argv.indexOf('--md');
const mdPath = mdIdx !== -1 ? argv[mdIdx + 1] : null;

let html;
try {
  html = fs.readFileSync(htmlPath, 'utf8');
} catch (e) {
  console.error(`无法读取 ${htmlPath}: ${e.message}`);
  process.exit(1);
}

const results = [];   // {name, pass, blocking, detail[]}
function check(name, pass, blocking, detail) {
  results.push({ name, pass, blocking, detail: detail || [] });
}

/* ============================================================
   ① 骨架
   ============================================================ */
(function checkSkeleton() {
  const missing = [];
  if (!/id=["']deck["']/.test(html)) missing.push('#deck');
  if (!/id=["']stage["']/.test(html)) missing.push('#stage');
  if (!/class=["'][^"']*\bslide\b/.test(html)) missing.push('.slide');
  const slideCount = (html.match(/<section[^>]*class=["'][^"']*\bslide\b/g) || []).length;
  check('骨架 #deck/#stage/.slide', missing.length === 0, true,
    missing.length ? [`缺少: ${missing.join(', ')}`] : [`slide 数量: ${slideCount}`]);
})();

/* ============================================================
   ② 禁色
   ============================================================ */
(function checkBannedColors() {
  const banned = [
    ['#2B7FD8', '旧参考 skill 暖蓝'],
    ['#FEFCF6', '旧参考 skill 暖底'],
    ['#FAF6EB', '旧参考 skill 暖底 2'],
    ['#1E40AF', '旧工作 prompt 蓝'],
  ];
  const hits = [];
  for (const [hex, label] of banned) {
    if (html.toLowerCase().includes(hex.toLowerCase())) hits.push(`${hex}（${label}）`);
  }
  // 纯黑页背景（#000/#000000 作 background）
  if (/background(?:-color)?\s*:\s*#000(?:000)?\b/i.test(html)) hits.push('纯黑背景 #000');
  check('禁色检查', hits.length === 0, true, hits.length ? hits : ['未发现禁用色值']);
})();

/* ============================================================
   ③ 禁忌式样
   ============================================================ */
(function checkBannedPatterns() {
  const hits = [];
  if (/backdrop-filter/i.test(html)) hits.push('backdrop-filter（glassmorphism）');
  if (/animation[^;}]*\b(bounce|elastic)/i.test(html)) hits.push('bounce/elastic 动画');
  if (/background-clip\s*:\s*text/i.test(html) || /-webkit-background-clip\s*:\s*text/i.test(html)) hits.push('渐变文字');
  // 文本箭头（-> 或 ▼），排除 HTML 注释
  const noComments = html.replace(/<!--[\s\S]*?-->/g, '');
  if (/->/.test(noComments)) hits.push('文本箭头 "->"');
  if (/▼/.test(noComments)) hits.push('文本箭头 "▼"');
  check('禁忌式样', hits.length === 0, true, hits.length ? hits : ['未发现禁忌式样']);
})();

/* ============================================================
   ④ 裸标签
   ============================================================ */
(function checkBareTags() {
  const hits = [];
  const re = /<(ul|ol|table|blockquote)(\s[^>]*)?>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[2] || '';
    if (!/\bclass\s*=/.test(attrs)) {
      hits.push(`<${m[1].toLowerCase()}> 无 class（位置 ${m.index}）`);
      if (hits.length >= 10) { hits.push('…更多省略'); break; }
    }
  }
  check('裸标签检查', hits.length === 0, true, hits.length ? hits : ['ul/ol/table/blockquote 均带 class']);
})();

/* ============================================================
   ⑤ 内容保真（--md 时）
   ============================================================ */
(function checkContentPreserved() {
  if (!mdPath) {
    check('内容保真', true, true, ['跳过（未提供 --md）']);
    return;
  }
  let md;
  try {
    md = fs.readFileSync(mdPath, 'utf8');
  } catch (e) {
    check('内容保真', false, true, [`无法读取 MD: ${e.message}`]);
    return;
  }

  const norm = s => String(s || '')
    .replace(/^\s*#{1,6}\s+/, '')
    .replace(/^\s*>\s?/, '')
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/^\s*\d+[.、)]\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/==/g, '')
    .replace(/`/g, '')
    // Insight/洞察 标记前缀：渲染时 head 与正文分属两元素，比对时去掉前缀
    .replace(/^(insight|洞察)\s*[:：]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 素材行（表格行拆单元格计入）
  const units = [];
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (/^\|?[\s:|-]+\|?$/.test(t) && t.includes('-')) continue; // 表格分隔行
    if (t.includes('|') && t.split('|').filter(s => s.trim()).length >= 2) {
      for (const cell of t.replace(/^\|/, '').replace(/\|$/, '').split('|')) {
        const c = norm(cell.replace(/\|/g, ' '));
        if (c.length >= 2) units.push(c);
      }
    } else {
      const n = norm(t);
      if (n.length >= 4) units.push(n);
    }
  }

  // HTML 去标签取纯文本（标签替换为空串，避免行内 span 在中文里引入伪空格）
  const deckText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

  // 去空格比对：数字与说明分属两元素渲染时标签剥离不产生空格，不应误报
  const deckTextSq = deckText.replace(/\s+/g, '');
  let hit = 0;
  const misses = [];
  for (const u of units) {
    if (deckTextSq.includes(u.replace(/\s+/g, ''))) hit++;
    else {
      misses.push(u);
      if (misses.length > 8) break;
    }
  }
  const coverage = units.length ? hit / units.length : 1;
  const pass = coverage >= 0.9;
  check('内容保真（覆盖率 ≥ 0.90）', pass, true,
    [`覆盖率 ${(coverage * 100).toFixed(1)}%（${hit}/${units.length}）`].concat(
      pass ? [] : ['未找到（示例）:'].concat(misses.map(m => '  · ' + m.slice(0, 50)))
    ));
})();

/* ============================================================
   ⑥ 编辑层注入
   ============================================================ */
(function checkEditableLayer() {
  const injected = /sz-editbar/.test(html) || (/contenteditable/.test(html) && /导出\s*PDF/.test(html));
  check('可编辑层注入', injected, true,
    injected ? ['editable-layer 已注入'] : ['未检测到 editable-layer（</body> 前注入 assets/editable-layer.html）']);
})();

/* ============================================================
   警告项（不阻断）
   ============================================================ */
(function warnScatteredHex() {
  const brandHexes = ['#0A3D8A', '#0E58C4', '#4A8EF2', '#7AB3F5', '#F0F4FA', '#F4D758'];
  // 去掉 :root{...} 定义块后统计
  const withoutRoot = html.replace(/:root\s*\{[\s\S]*?\}/g, '');
  const hits = brandHexes.filter(h => withoutRoot.toLowerCase().includes(h.toLowerCase()));
  check('【警告】品牌色值散落 :root 之外', hits.length === 0, false,
    hits.length ? [`${hits.join(', ')} 应改用 var(--…)`] : ['色值均走 CSS 变量']);
})();

(function warnEmoji() {
  // 常见 emoji 区段（排除常规符号）
  const emojiRe = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const noComments = html.replace(/<!--[\s\S]*?-->/g, '');
  const has = emojiRe.test(noComments);
  check('【警告】emoji 使用', !has, false, has ? ['检测到 emoji（品牌禁忌：图标一律内联 SVG）'] : ['无 emoji']);
})();

/* ============================================================
   输出
   ============================================================ */
console.log(`\n上咨 deck P0 机械校验 · ${htmlPath}\n${'='.repeat(56)}`);
let failCount = 0;
for (const r of results) {
  const mark = r.pass ? '✓' : (r.blocking ? '✗' : '⚠');
  console.log(`\n${mark} ${r.name}`);
  for (const d of r.detail) console.log(`    ${d}`);
  if (!r.pass && r.blocking) failCount++;
}
console.log(`\n${'='.repeat(56)}`);
if (failCount) {
  console.log(`裁决：FAIL（${failCount} 项 P0 未过）——打回整改，不得交付\n`);
  process.exit(1);
} else {
  console.log('裁决：PASS（P0 全过）\n');
  process.exit(0);
}
