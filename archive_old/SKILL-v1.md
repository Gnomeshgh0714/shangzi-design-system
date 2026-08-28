---
name: shangzi-design-system
description: 上咨集团 HTML 汇报/提案制作 skill。把报告 MD/数据/素材或方案文档，生成上咨品牌风格（蓝色梯度+暖黄点睛）的 16:9 数据汇报 deck 或滚动长页提案。双场景：deck（市场监测/洞察报告，Chart.js 数据驱动）+ 长页（方案/战略提案，提案式骨架）。触发词：做 HTML 汇报/做 deck/做 PPT/市场监测报告/洞察报告/方案提案/战略汇报/把报告转 HTML/把 MD 转 HTML 演示。
---

# 上咨汇报设计系统 · SKILL

> 本 skill 是上咨集团所有 HTML 汇报/提案产物的**唯一真理源**。替代被架空的旧参考 skill 与自成一体的工作 prompt。
> 三层架构：**SKILL.md（流程）-> brand-dna.md + references/*（规范）-> assets/template-*.html（起点）**。
> 设计理念：限制 AI 自由度 = 保证输出一致性。不能发明配色（只能用上咨蓝梯度）、不能发明布局（只能选 layouts.md 的）、不能从零写（必须从模板起步）、做完要自检（P0 不过打回）。

---

## 触发场景

用户要求做 HTML 网页/HTML 汇报/做 deck/做 PPT/做幻灯片/市场监测报告/洞察报告/方案提案/战略汇报/项目建议书/把报告转 HTML/把 MD 转 HTML 演示/把文档转长页 时触发。

## 双场景速查

| 用户要的是 | 走哪个场景 | 读哪个 scene | 用哪个模板 |
|---|---|---|---|
| 数据汇报/市场监测/洞察报告（有数据表、要图表、翻页演示） | **deck** | `references/scene-deck.md` | `assets/template-deck.html` |
| 方案/提案/战略汇报（叙事型、滚动浏览、提案式） | **长页** | `references/scene-long.md` | `assets/template-long.html` |

拿不准时问用户：**翻页 deck 还是滚动长页？**

---

## 8 步工作流

### Step 1 · 澄清需求
向用户确认 5 个问题：
1. **类型**：deck（数据汇报）还是长页（方案提案）？
2. **受众**：给谁看？高管/部门/客户？
3. **页数/section 数**：大概几页/几节？
4. **素材**：有哪些 MD/Excel/logo/数据？是否取 MD 原文？
5. **硬约束**：必须包含什么？封面用客户原图？品牌色锁定？

### Step 2 · 读规范
1. **必读** `brand-dna.md` -- 确认上咨蓝梯度配色/字体/禁忌。
2. 按类型读场景文件：deck -> `scene-deck.md`；长页 -> `scene-long.md`。
3. 速览 `layouts.md`（布局）、`components.md`（组件）、`checklist.md`（验收）。

### Step 3 · 输出 MD 素材稿，等用户确认 ⭐硬门控
**在生成 HTML 之前**，先输出一份 `.md` 素材稿，列出每页/每节的内容与排版方案，交用户确认。**用户确认后才进入 Step 4。**
- deck 素材稿格式见 `scene-deck.md`「MD 素材稿格式」。
- 长页素材稿：每节给「类型/布局/标题/内容要点/来源」。
- MD 是 single source of truth；后续修改改 MD 再重生 HTML。
- **内容铁律**：洞察/脚注/标题 100% 取素材原文含标点，禁止改写/概括/补充。

### Step 4 · 拷模板 ⭐不可跳过
从 `assets/` 选对应模板**拷贝起步**：deck -> `template-deck.html`；长页 -> `template-long.html`。**严禁从零写。**

**机械校验（交付时必过）**：
- deck 产出必须含 `#deck` / `#stage` / `.slide` 三者之一为根容器。
- 长页产出必须含 `.sec` / `.wrap`。
- 不含 = 从零写 = 打回重来。

### Step 5 · 选布局组合
按素材稿确认的方案，为每页/每 section 分配布局（deck 页型见 `layouts.md`「Deck 页型」；长页见「长页 section 布局」）。**每页/每 section 布局必须不同**（相邻不撞）。

### Step 6 · 选组件填充
从 `components.md` 选取组件填入。**硬规则：禁止使用 HTML 默认样式。** 裸 `<ul>/<table>/<blockquote>` 必须带 components.md 的 class。

**机械校验**：deck 用 `template-deck` 的类（`.pgtitle/.ctitle/.ins-grp/.heat/.kf-item/.pbtn/.panel/.inspanel` 等）；长页用 `template-long` 的类（`.flywheel/.pyramid/.org-chart/.timeline-h/.step-block/.formula-box` 等）。自定义组件须符合 `brand-dna.md`，不得引入蓝梯度外的色。

### Step 7 · 自检
对照 `checklist.md` 逐条检查：P0 必须全过（不过改到过）、P1 应过、P2 加分。deck 额外过 `scene-deck.md` 验收清单；长页额外过 `scene-long.md` 要点。

**重点机械校验项**：
- 不出现 旧参考 skill 暖三色（`#2B7FD8`/`#fefcf6`）/ 旧工作 prompt 蓝 `#1E40AF` / 纯黑纯白大面积底。
- deck：1600×900 画布、每页单屏无滚动、按钮切换页 inspanel 联动存在、数据标签含 0%。
- 长页：clamp() 流式、reveal 动效、侧边导航自动构建、无重复 id、无内联 style 散落。

### Step 8 · 交付
输出最终 HTML 文件，确保浏览器可直接打开。
- **deck 额外**：`</body>` 前注入 `assets/editable-layer.html`（浏览器内编辑 + 导出 PDF + 保存 HTML）。
- **导出**（skill 目录运行，需先 `npm install`）：`node generate_pdf.cjs <file.html> [--png]` 出 PDF/逐页 PNG；`node convert_pptx.cjs <file.html> --page N` 单页转可编辑 PPTX。

---

## 关键原则

1. **从模板起步，不从零写**（Step 4 机械校验强制）。
2. **每页/每 section 布局必须不同**。
3. **内容完整保留，只重组版式**（不删字、不改写）。
4. **用上咨蓝梯度 + 暖黄点睛**，不发明配色。
5. **做完必须跑 checklist**（P0 全过才能交付）。
6. **永远不截图查看**（项目铁律，见 CLAUDE.md 第 6 条）--以代码/构建输出/文件解析为准。

## 禁忌（详见 brand-dna.md）

核心底线：截图发出去不被说「又是 AI 做的」；蓝色梯度可识别；像上咨出的。具体禁忌：蓝紫渐变、glassmorphism、neon、bounce/elastic、AI 光效、渐变文字、emoji 当图标、文本箭头、HTML 默认样式、纯黑纯白大面积底、旧参考 skill 暖三色混入。

---

## 文件索引

```
shangzi-design-system/
├── SKILL.md                 # 本文件（流程）
├── brand-dna.md             # 品牌基因（配色/字体/气质/禁忌）
├── README.md                # 给人看的说明
├── package.json             # 导出脚本依赖
├── generate_pdf.cjs         # 导出 PDF/PNG
├── convert_pptx.cjs         # 单页转可编辑 PPTX
├── assets/
│   ├── template-deck.html   # deck 母版
│   ├── template-long.html   # 长页母版
│   ├── editable-layer.html  # 可编辑层
│   ├── chart-plugins.js     # Chart.js 插件
│   └── logos/               # logo 素材
└── references/
    ├── layouts.md           # 布局库（deck 页型 + 长页 section + 映射）
    ├── components.md        # 组件库（slug 命名）
    ├── checklist.md         # 通用质量清单
    ├── scene-deck.md        # deck 场景规范
    └── scene-long.md        # 长页场景规范
```
