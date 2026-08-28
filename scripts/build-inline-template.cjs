#!/usr/bin/env node
/**
 * build-inline-template.cjs · 生成 Web 版内联模板模块
 *
 * 为什么需要：Web 版（distribution/）在 file:// 下运行，fetch 本地文件被 CORS 拦，
 * 母版必须内联成 JS 字符串。本脚本把 assets/ 的母版转成
 * distribution/webapp/generator/default-template.js（自包含，可独立分发）。
 *
 * 转换规则：
 *  - 剥离 template-deck.html 的 8 页示例 slide，替换为槽位 <!-- @slot slides -->
 *  - 保留 :root 变量 / 全部组件 class / 翻页缩放 IIFE JS / 打印样式
 *  - 保留 <!-- @inject editable-layer.html --> 注入点
 *  - editable-layer.html 原样内联
 *  - 每行 JSON.stringify 输出，任何内容（引号/反引号/${}）都安全
 *
 * 用法：node scripts/build-inline-template.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const tplPath = path.join(ROOT, 'assets', 'template-deck.html');
const layerPath = path.join(ROOT, 'assets', 'editable-layer.html');
const outPath = path.join(ROOT, 'distribution', 'webapp', 'generator', 'default-template.js');

let tpl = fs.readFileSync(tplPath, 'utf8');
const layer = fs.readFileSync(layerPath, 'utf8');

// 1. 剥离示例 slide（#stage 内整段换成槽位）
const stageRe = /(<div id="deck"><div id="stage">)[\s\S]*?(<\/div><\/div>\s*\n\s*<!-- 翻页钮)/;
if (!stageRe.test(tpl)) {
  console.error('未找到 #stage 示例 slide 区段，母版结构可能已变化，请检查');
  process.exit(1);
}
tpl = tpl.replace(stageRe, '$1\n\n<!-- @slot slides -->\n\n$2');

// 2. 标题换成通用占位（assembleDeck 会按报告名替换）
tpl = tpl.replace(/<title>[\s\S]*?<\/title>/, '<title>上咨汇报 deck</title>');

// 3. 校验关键结构仍在
for (const needle of [':root', 'id="stage"', '<!-- @slot slides -->', '<!-- @inject editable-layer.html -->', 'fitStage']) {
  if (!tpl.includes(needle)) {
    console.error(`转换后缺少关键结构: ${needle}`);
    process.exit(1);
  }
}
if (/<section[^>]*class=["'][^"']*\bslide\b/.test(tpl)) {
  console.error('示例 slide 未剥离干净');
  process.exit(1);
}

// 4. 输出为「每行 JSON.stringify + join」的安全形式
function toLinesArray(name, content) {
  const lines = content.replace(/\r\n/g, '\n').split('\n').map(l => JSON.stringify(l));
  return `const ${name} = [\n${lines.join(',\n')}\n].join('\\n');`;
}

const out = `/**
 * default-template.js · 内联母版（自动生成，勿手改）
 * 生成自：shangzi-design-system/scripts/build-inline-template.cjs
 * 源文件：assets/template-deck.html（剥离示例 slide，留槽位）+ assets/editable-layer.html
 * 重新生成：node scripts/build-inline-template.cjs
 *
 * SZTemplate 接口：
 *  - getTemplate()     取当前模板（localStorage.sz_template 里的自定义模板优先，需过骨架校验）
 *  - setCustom(html)   设置自定义模板（将来「使用者自主上传模板」的落点）
 *  - resetCustom()     恢复内置默认
 *  - getEditableLayer() 可编辑层 HTML
 */

${toLinesArray('DECK_TEMPLATE', tpl)}

${toLinesArray('EDITABLE_LAYER', layer)}

const SZTemplate = {
  DECK_TEMPLATE,
  EDITABLE_LAYER,
  SLOT_SLIDES: '<!-- @slot slides -->',
  INJECT_LAYER: '<!-- @inject editable-layer.html -->',

  /** 骨架校验：是否具备 deck 母版的关键结构 */
  isDeckTemplate(html) {
    return !!html
      && /id=["']deck["']/.test(html)
      && /id=["']stage["']/.test(html)
      && /\\bfitStage\\b/.test(html);
  },

  /** 取当前模板：自定义模板（localStorage）校验通过则用，否则内置默认 */
  getTemplate() {
    try {
      if (typeof localStorage !== 'undefined') {
        const custom = localStorage.getItem('sz_template');
        if (custom && this.isDeckTemplate(custom) && custom.indexOf(this.SLOT_SLIDES) !== -1) {
          return custom;
        }
      }
    } catch (e) { /* Node 环境或 localStorage 不可用 */ }
    return DECK_TEMPLATE;
  },

  /** 设置自定义模板（必须含 slides 槽位与 deck 骨架） */
  setCustom(html) {
    if (!this.isDeckTemplate(html)) throw new Error('模板缺少 #deck/#stage 骨架');
    if (html.indexOf(this.SLOT_SLIDES) === -1) throw new Error('模板缺少 slides 槽位 <!-- @slot slides -->');
    localStorage.setItem('sz_template', html);
  },

  resetCustom() {
    try { localStorage.removeItem('sz_template'); } catch (e) {}
  },

  getEditableLayer() {
    return EDITABLE_LAYER;
  },
};

// 挂到 window
if (typeof window !== 'undefined') {
  window.SZTemplate = SZTemplate;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SZTemplate;
}
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, 'utf8');
console.log(`✓ 已生成 ${outPath}`);
console.log(`  母版 ${tpl.length} 字符（已剥离示例 slide）+ 编辑层 ${layer.length} 字符`);
