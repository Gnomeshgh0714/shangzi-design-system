# 质量检查清单 · shangzi-design-system

> 通用清单（deck 与长页共用）。场景专属检查项在 `scene-deck.md` / `scene-long.md`。
> **修旧参考 skill 三处矛盾**：不再把「衬线混搭」「clamp()」「组件必须来自 components.md」放进通用 P0--这三条只适用长页或与模板自带类冲突，已下沉到 scene 或改为「用对应模板的类」。
> 用法：交付前逐条 `- [ ]` 勾选；P0 不过打回。

---

## P0 · 必须全过（不过打回）

- [ ] **配色正确**：用上咨蓝梯度（`#0A3D8A/#0E58C4/#4A8EF2/#7AB3F5/#F0F4FA`）+ 灰 `#60616B` + 墨 `#1A1A2E` + 暖黄 `#F4D758` 点睛；**不出现** 旧参考 skill 暖三色（`#2B7FD8`/`#fefcf6`/`#faf6eb` 系）/ 旧工作 prompt 蓝 `#1E40AF` / 纯黑 `#000` 做页面背景。白底 section/卡片允许，整屏页面背景不用纯白纯黑。
- [ ] **无禁忌元素**：无蓝紫渐变、glassmorphism、neon、bounce/elastic、AI 光效、渐变文字、emoji 当图标、文本箭头 `->`/`▼`。
- [ ] **从模板起步**（机械校验）：deck 产出含 `#deck`/`#stage`/`.slide`；长页产出含 `.sec`/`.wrap`。不含 = 从零写 = 打回。
- [ ] **无 HTML 默认样式**：裸 `<ul>/<ol>/<table>/<blockquote>` 必须带 components.md 的 class（如 `.ins-grp`/`.heat`/`.kflist`）。
- [ ] **内容素材完整保留**：用户给定的文字/数据一字未删，只重组版式（信息密度高是优点）。
- [ ] **用了 `:root` 变量**：色值通过 `var(--blue)` 等引用，不硬编码散落（热力图 `rgba` 除外，属数据语义色）。
- [ ] **整体气质**：像上咨出的、蓝色梯度可识别、不像 AI。

## P1 · 应过（提升品质）

- [ ] **版式多样**：每页/每 section 布局不重复（相邻不撞）。
- [ ] **字号对比极端**：大的足够大（deck 标题 28+ / 长页 Hero clamp 上限），小的足够小（脚注 11.5-13）。
- [ ] **有动效**：长页有 reveal 错峰入场 + 侧边导航高亮 + 进度条；deck 有翻页过渡（尊重 `prefers-reduced-motion`）。
- [ ] **装饰元素**：用了 `.big-ghost` 装饰大字或 `.kicker` 黄短线。
- [ ] **暖黄点睛**：至少一处暖黄高亮（`.hl`/`::selection`/CTA），但 ≤10% 比例。
- [ ] **暗色面板换气**：至少一个 `.sec--dark`/`.dark-panel` 打破节奏。

## P2 · 加分

- [ ] **打印/导出可用**：deck `@page` 16:9 + 按钮切换页可逐面板成页；长页 `@media print` 分节不切断。
- [ ] **可编辑层已注入**（deck）：`</body>` 前注入 `editable-layer.html`。
- [ ] **无障碍**：`<img>` 有 `alt`；`<canvas>` 有兜底文字；颜色不是唯一信息编码。
- [ ] **单文件自包含**：无外链 CSS/JS（Google Fonts 除外）；图片 base64 或本地路径可解析。

---

## 场景专属补充（见各自 scene 文件）

- **deck**（`scene-deck.md`）：1600×900 画布、scale 缩放、每页单屏无滚动、数据标签含 0%、inspanel 联动、Chart.js 规格等。**这部分是 deck 独有，不放通用清单。**
- **长页**（`scene-long.md`）：clamp() 流式、900/560 断点、reveal 动效、侧边导航自动构建等。**clamp 只强制长页，deck 用固定 px 不算违规。**

> 说明：旧参考 skill 通用清单要求「clamp()」「衬线混搭」导致 deck 场景永远判不合格--本清单已修正，这两条仅长页强制。
