# Scene · Long（滚动长页方案/提案）

> 上咨汇报设计系统的**第二场景**：把方案/提案/战略汇报内容，生成滚动式长页 HTML。
> 视觉骨架源自早期提案长页，**重配色为上咨蓝梯度 + 暖黄点睛**，并修复旧长页的全部坏味道（见末尾对照）。
> 模板起点：`assets/template-long.html`。配色/字体见 `brand-dna.md`。

---

## 触发场景

做方案提案 / 战略汇报 / 项目建议书 / 提案式滚动长页 / 把方案文档转 HTML 长页。与 deck 的区别：deck 是 16:9 翻页数据汇报，长页是滚动叙事。

---

## 📐 页面规格

| 项 | 规格 |
|---|---|
| 形态 | 单 HTML 纵向滚动长页，多个 `<section class="sec">` |
| 宽度 | `.wrap` max-width 1280px + `clamp(24px,5vw,64px)` 左右 padding |
| 字号策略 | **clamp() 流式**（`clamp(min,vw,max)`），不靠媒体查询 |
| 间距 | section 间 `clamp(72px,11vh,140px) 0` |
| 模板 | `assets/template-long.html`（含 reveal 动效 / 侧边导航 / 进度条 JS） |
| 背景 | 冷蓝页面底 `#F0F4FA`（与 deck 一致，**不用旧参考 skill 暖底 `#fefcf6`**）；section 交替白底 `#fff` / 浅蓝 `#F0F4FA` / 深蓝 `--dark-panel` |

---

## 🔤 字体与字号

| 用途 | 字体 |
|---|---|
| 中文正文 | `'Noto Sans SC','PingFang SC',-apple-system,sans-serif` |
| 中文标题 | `'Noto Serif SC'` weight 700/900（衬线粗标题，旧长页质感） |
| 英文装饰/编号 | `'Fraunces'` italic |
| 等宽（可选） | `'Fira Code',monospace` |

**clamp 字号系统**：
- Hero `clamp(2.8rem,7vw,5.5rem)`
- Section 标题 `.s-title` `clamp(1.7rem,3.7vw,2.8rem)`
- 卡片标题 `.kw` `clamp(1.3rem,2vw,1.6rem)`
- 正文 16px / lead `clamp(1rem,1.4vw,1.15rem)`
- 辅助 `0.78~0.85rem`
- 装饰大字 `.big-ghost` `clamp(8rem,22vw,20rem)` opacity 0.08
- **铁律**：对比极端，宁大勿小。

---

## 📝 核心排版原则

1. **每 section 布局必须不同**（相邻不撞）--见 layouts.md 长页 section 布局。
2. **标题三件套**：`.kicker`（Fraunces 斜体+黄短线）-> `.s-title`（衬线粗标题 + `.hl` 黄高亮 + `.b` 蓝词）-> `.lead`（浅灰导语）。每个 section 必有。
3. **节奏交替**：`.sec`(白/暖底) -> `.sec--alt`(浅蓝) -> `.sec--dark`(深蓝) 交替，避免连续同底。
4. **左对齐为主**，禁止居中病。
5. **内容完整保留**，用结构替代堆砌。

---

## 🧩 section 布局（详见 layouts.md「长页 section 布局」）

10 种：`sec-hero-flywheel` / `sec-dark-formula` / `sec-step-progression` / `sec-org-chart` / `sec-pyramid` / `sec-timeline` / `sec-card-grid` / `sec-dark-kpi` / `sec-quote` / `sec-compare`。

典型长页页序（方案提案，可裁剪）：
封面飞轮 -> 项目命题(暗色公式) -> 项目背景(三段递进) -> 组织全景(三层架构) -> Skill体系(金字塔) -> Agent权责(双栏) -> 管理制度(五列) -> 实施保障(时间轴+甘特) -> 培训共创(时间轴) -> 核心考核(暗色KPI)。

---

## 🧩 组件（详见 components.md「长页组件」）

飞轮 `.flywheel` / 金字塔 `.pyramid` / 组织架构图 `.org-chart` / 水平时间轴 `.timeline-h` / 步骤块 `.step-block` / 公式框 `.formula-box` / 卡片网格 `.grid.cols-N + .box` / 标题三件套 `.kicker+.s-title+.lead` / 装饰大字 `.big-ghost` / 标签 `.tag` / 侧边导航 `#sidenav` + 进度条 `#prog`。

---

## ✨ 动效

- **reveal 入场**：`.reveal` 初始 `opacity:0;translateY(34px)`，IntersectionObserver `threshold:.12` 加 `.in`，`cubic-bezier(.16,1,.3,1)` 0.7s。`.rd1~.rd6` 错峰延迟 0.08s 递增。
- **侧边导航高亮**：第二个 IntersectionObserver `threshold:.4`，当前 section 对应圆点 `.on`。
- **进度条**：scroll 事件算 `scrollY/scrollHeight` 占比，`#prog` 宽度。
- **飞轮旋转**：`@keyframes spin` 30s linear infinite（`.fw-ring`）。
- **尊重** `prefers-reduced-motion`：全部禁用动效，`.reveal` 直显。

---

## 📱 响应式

- 断点 `max-width:900px`：多栏降单栏、侧边导航隐藏、时间轴连线隐藏。
- 断点 `max-width:560px`：网格列数减半（3->1）、sub-kpi 单列。
- 移动端是「重新排列」不是「缩小」。

---

## 🖨 打印

```css
@page{size:A4;margin:14mm;}
@media print{
  #sidenav,#prog{display:none;}
  .sec{page-break-inside:avoid;padding:20px 0;}
  .reveal{opacity:1;transform:none;}
  .sec--dark{print-color-adjust:exact;}
}
```

---

## 🔧 旧长页坏味道修复对照（template-long.html 已修）

| 旧长页问题 | 本模板修复 |
|---|---|
| 545 处内联 style（组织图/金字塔尤甚） | 全部 class 化（`.pyr-tier`/`.org-tier`/`.org-node` 等） |
| 重复 id（`id="p8"` 两次） | 每个 section 唯一 id |
| 未定义色（碳基紫 `#7C5CBF`/硅基绿 `#27A36B`/硬编码蓝） | 删除，收编为上咨蓝梯度变量 |
| 文本箭头 `->`/`▼`/`↓` | `▼` 保留作金字塔层间符（语义明确），其余换 CSS 伪元素/SVG |
| div 不匹配（690 开/692 闭） | 严格匹配，每 section 闭合校验 |
| emoji 当图标（🤖👤💼） | 保留作占位，正式产出换内联 SVG（见 components.md「SVG 图标规范」） |
| Caveat 字体加载未用 | 不引入 Caveat |
| 甘特图 body 内嵌 `<style>` | 样式全入 `<head>` 主 `<style>` |
| `@media print` class 白名单过长 | 简化为 `.sec` page-break + `.reveal` 直显 |
| 配色用旧参考 skill 暖三色 | 重配色为上咨蓝梯度 + 暖黄点睛 |

---

## 📤 交付纪律

- 单文件自包含（Google Fonts CDN 除外，正式离线可内联字体）。
- 每次修改另存版本，绝不覆盖。
- 不用 `localStorage/sessionStorage`。
- 长页一般不注入 editable-layer（如需浏览器内编辑，可注入 deck 版 editable-layer，scale 逻辑不影响长页）。
