#!/usr/bin/env node
/* ============================================================
  上咨汇报设计系统 · 导出 PDF / 逐页 PNG
  用 Puppeteer 渲染 deck HTML，每页一张 PDF / PNG。
  修复旧版脚本：依赖通过本目录 package.json 安装（npm install），路径用 __dirname 解析。
  用法：
    node generate_pdf.cjs <deck.html>              # 出 PDF
    node generate_pdf.cjs <deck.html> --png        # 出逐页 PNG
    node generate_pdf.cjs <deck.html> --out ./out  # 指定输出目录
============================================================ */
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');  // 经 __dirname/node_modules 解析

const args = process.argv.slice(2);
const fileArg = args.find(a => !a.startsWith('-'));
const wantPng = args.includes('--png');
const outIdx = args.indexOf('--out');
const outDir = outIdx > -1 ? args[outIdx + 1] : path.dirname(path.resolve(fileArg || '.'));

if (!fileArg) {
  console.error('用法: node generate_pdf.cjs <deck.html> [--png] [--out <dir>]');
  process.exit(1);
}

const absPath = path.resolve(fileArg);
if (!fs.existsSync(absPath)) { console.error('文件不存在: ' + absPath); process.exit(1); }

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });
  await page.goto('file://' + absPath, { waitUntil: 'networkidle0' });

  // 关掉舞台缩放，让每页按 1600×900 原尺寸渲染
  await page.addStyleTag({ content: '#stage{transform:none !important;}' });

  const isDeck = await page.$('.slide') !== null;

  if (!isDeck) {
    // 长页：整页 PDF
    const outFile = path.join(outDir, path.basename(absPath, '.html') + '.pdf');
    await page.pdf({ path: outFile, format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm' } });
    console.log('✓ PDF: ' + outFile);
  } else if (wantPng) {
    // deck 逐页 PNG
    const count = await page.$$eval('.slide', els => els.length);
    for (let i = 0; i < count; i++) {
      await page.evaluate(idx => {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((s, j) => s.classList.toggle('active', j === idx));
        // 等图表渲染
        return new Promise(r => setTimeout(r, 200));
      }, i);
      const outFile = path.join(outDir, `${path.basename(absPath, '.html')}_p${String(i + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: outFile, fullPage: false, clip: { x: 0, y: 0, width: 1600, height: 900 } });
      console.log('✓ PNG: ' + outFile);
    }
  } else {
    // deck PDF：靠 @page 1600×900 + page-break-after，逐页一张
    const outFile = path.join(outDir, path.basename(absPath, '.html') + '.pdf');
    await page.evaluate(() => {
      // 让所有 slide 显示，靠 CSS page-break 分页
      document.querySelectorAll('.slide').forEach(s => s.style.display = 'block');
    });
    await page.pdf({
      path: outFile,
      width: '1600px', height: '900px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: '1-'
    });
    console.log('✓ PDF: ' + outFile);
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
