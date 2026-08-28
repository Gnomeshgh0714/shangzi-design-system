#!/usr/bin/env node
/* ============================================================
  上咨汇报设计系统 · 单页转可编辑 PPTX
  用 Puppeteer 渲染 deck 某一页，读取元素 boundingRect + 计算样式，
  用 pptxgenjs 重建为原生文本框 + 色块（可编辑）。
  修复旧版脚本：依赖经 package.json 安装，路径用 __dirname 解析。
  用法：
    node convert_pptx.cjs <deck.html> --page 3           # 转第 3 页
    node convert_pptx.cjs <deck.html> --page 3 --out ./out
  已知限制：CSS 渐变近似为首色纯色；外链 img 不嵌入；背景图不转。
============================================================ */
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const pptxgen = require('pptxgenjs');

const args = process.argv.slice(2);
const fileArg = args.find(a => !a.startsWith('-'));
const pageIdx = args.indexOf('--page');
const pageNum = pageIdx > -1 ? parseInt(args[pageIdx + 1], 10) : 1;
const outIdx = args.indexOf('--out');
const outDir = outIdx > -1 ? args[outIdx + 1] : path.dirname(path.resolve(fileArg || '.'));

if (!fileArg) { console.error('用法: node convert_pptx.cjs <deck.html> --page <N> [--out <dir>]'); process.exit(1); }
const absPath = path.resolve(fileArg);
if (!fs.existsSync(absPath)) { console.error('文件不存在: ' + absPath); process.exit(1); }

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
  await page.goto('file://' + absPath, { waitUntil: 'networkidle0' });
  await page.addStyleTag({ content: '#stage{transform:none !important;}' });

  // 激活目标页
  await page.evaluate(idx => {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, j) => s.classList.toggle('active', j === idx));
    return new Promise(r => setTimeout(r, 300));
  }, pageNum - 1);

  // 采集可见文本元素：取有直接文本的叶子/半叶子元素
  const elements = await page.evaluate(() => {
    const slide = document.querySelector('.slide.active') || document.querySelector('.slide');
    if (!slide) return [];
    const sr = slide.getBoundingClientRect();
    const out = [];
    const walk = (el) => {
      // 背景色块（有 bg 的容器）
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      const r = el.getBoundingClientRect();
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && r.width > 4 && r.height > 4 && el !== slide) {
        out.push({ type: 'rect', x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height, bg, z: 0 });
      }
      // 直接文本（非空、不含子元素文本，避免重复）
      const ownText = Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      if (ownText && r.width > 0) {
        out.push({
          type: 'text', text: ownText,
          x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height,
          color: cs.color, fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight,
          align: cs.textAlign, z: 1
        });
      }
      Array.from(el.children).forEach(walk);
    };
    walk(slide);
    return out;
  });

  await browser.close();

  // 重建为 PPTX（13.333×7.5 in，1600×900 px -> 13.333×7.5）
  const SX = 13.333 / 1600, SY = 7.5 / 900;
  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'SZ16x9', width: 13.333, height: 7.5 });
  pptx.layout = 'SZ16x9';
  const s = pptx.addSlide();

  // 背景白
  s.background = { color: 'FFFFFF' };

  // 先画色块（z=0），再画文本（z=1）
  elements.filter(e => e.type === 'rect').forEach(e => {
    s.addShape(pptx.ShapeType.rect, {
      x: e.x * SX, y: e.y * SY, w: e.w * SX, h: e.h * SY,
      fill: { color: rgb(e.bg) }, line: { type: 'none' }
    });
  });
  elements.filter(e => e.type === 'text').forEach(e => {
    s.addText(e.text, {
      x: e.x * SX, y: e.y * SY, w: e.w * SX, h: e.h * SY,
      fontSize: Math.max(6, e.fontSize * SY),  // px->pt 近似
      color: rgb(e.color),
      bold: String(e.fontWeight).toString() === '700' || String(e.fontWeight).toString() === '800' || String(e.fontWeight).toString() === '900',
      align: e.align === 'center' ? 'center' : (e.align === 'right' ? 'right' : 'left'),
      valign: 'middle', margin: 0
    });
  });

  const outFile = path.join(outDir, `${path.basename(absPath, '.html')}_p${pageNum}.pptx`);
  await pptx.writeFile({ fileName: outFile });
  console.log(`✓ PPTX: ${outFile} (${elements.length} elements)`);
})().catch(e => { console.error(e); process.exit(1); });

// rgba(r,g,b,a) / rgb(r,g,b) / #hex -> pptx 6位 hex
function rgb(c) {
  if (!c) return '1A1A2E';
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('').toUpperCase();
  if (c.startsWith('#')) return c.slice(1).toUpperCase();
  return '1A1A2E';
}
