# 上咨汇报设计系统（shangzi-design-system）

> **当前版本 v2.2 · MD 工作台模式（2026-08-20）**：内容先行——先与 AI 对话打磨 MD 定稿，再逐页「确认内容→确认版式→单页试做调好」装进框架成整体 deck，P0 机械校验把关；带自主边界三区表、learnings.md 自学习账本、library/ 模板素材库与 3 个专职 agent。
> **同事安装与使用见 `使用指南-同事版.md`；完整流程见 `SKILL.md`。** 以下保留 v1 背景介绍（配色由来/双场景/三层架构依然有效）。

上咨集团 HTML 汇报/提案制作的 skill。把报告 MD/数据/素材或方案文档，生成上咨品牌风格（**蓝色梯度 + 暖黄点睛**）的 HTML 产物。

## 为什么有这个 skill

此前工作区存在**两套并行且冲突的规范**：一份旧参考 skill（暖三色，内部矛盾多、导出脚本坏）+ 一份自成一体的「HTML汇报版生成Prompt」（自带蓝色方案，完全绕开 skill）。早期两份产出各随一套规范、各坏各的。

本 skill **收口为唯一真理源**：吸收工作 prompt 的全部硬规格（成为 `scene-deck.md`），参考旧 skill 的三层框架（流程->规范->模板），重配色为上咨 PPT 模板实测的蓝色梯度，修复旧参考 skill 全部硬伤与工作 prompt 的设计缺陷。

## 配色（源自上咨 PPT 模板）

`#0A3D8A`(深) -> `#0E58C4`(品牌蓝) -> `#4A8EF2`(中) -> `#7AB3F5`(浅) -> `#F0F4FA`(背景蓝) + 灰 `#60616B` + 墨 `#1A1A2E` + 暖黄 `#F4D758` 点睛。

> 配色解析自公司 PPT 模板的 `theme1.xml`（纯 XML 解析，未截图）。

## 双场景

| 场景 | 用途 | 模板 | scene 文件 |
|---|---|---|---|
| **deck** | 市场监测/洞察报告（数据表、Chart.js 图表、16:9 翻页） | `assets/template-deck.html` | `references/scene-deck.md` |
| **长页** | 方案/提案/战略汇报（叙事型、滚动、提案式骨架） | `assets/template-long.html` | `references/scene-long.md` |

## 核心逻辑（三层架构）

```
SKILL.md（流程 - AI 按什么步骤干活）
    ↓
brand-dna.md + references/*（规范 - 能用什么不能用什么）
    ↓
assets/template-*.html（起点 - 从模板改，不从零写）
```

## 8 步工作流（摘要）

1. 澄清需求（5 问：类型/受众/页数/素材/硬约束）
2. 读规范（brand-dna + 对应 scene）
3. **输出 MD 素材稿，等用户确认**（硬门控）
4. **拷模板起步**（不可跳过，机械校验：deck 含 `#stage/.slide`，长页含 `.sec/.wrap`）
5. 选布局（layouts.md，每页/每 section 布局不同）
6. 选组件填充（components.md，禁 HTML 默认样式）
7. 自检（checklist.md，P0 全过才能交付）
8. 交付（deck 注入 editable-layer；可选导出 PDF/PPTX）

详见 `SKILL.md`。

## 使用

### 给 AI 用（触发 skill）
把本目录作为 skill 暴露给 Claude Code。用户说「做 HTML 汇报/做 deck/市场监测报告/方案提案」等触发词时，AI 按 `SKILL.md` 的 8 步执行。

### 导出 PDF / PPTX
导出脚本依赖 puppeteer + pptxgenjs，**首次使用需安装**（修旧版脚本开箱即坏）：

```bash
cd shangzi-design-system
npm install
# 导出 PDF / 逐页 PNG
node generate_pdf.cjs <你的deck.html> [--png] [--out 输出目录]
# 单页转可编辑 PPTX
node convert_pptx.cjs <你的deck.html> --page 3
```

已知限制：CSS 渐变近似为首色纯色；外链 img 不嵌入 PPTX；路径含中文/空格需先 copy 到纯英文路径。

### 浏览器内编辑（deck）
交付的 deck HTML 在 `</body>` 前注入了 `editable-layer.html`。右下角 ✏️ 进入编辑：点文字修改，工具条加粗/斜体/字号/颜色/高亮，导出 PDF 或保存 HTML。

## 文件结构

```
shangzi-design-system/
├── SKILL.md                 # 入口：8步工作流、双场景速查、触发词
├── brand-dna.md             # 品牌基因：蓝梯度配色/字体/气质/间距/禁忌
├── README.md                # 本文件
├── package.json             # 导出脚本依赖
├── generate_pdf.cjs         # Puppeteer 导出 PDF/PNG
├── convert_pptx.cjs         # 单页转可编辑 PPTX
├── assets/
│   ├── template-deck.html   # deck 母版（1600×900+scale JS+Chart.js 脚手架+inspanel 联动）
│   ├── template-long.html   # 长页母版（提案式骨架 class 化+上咨蓝重配色+reveal 动效）
│   ├── editable-layer.html  # 浏览器内可编辑层
│   ├── chart-plugins.js     # Chart.js 插件（logoAxis/stackLeader/colauto/ryg）
│   └── logos/               # logo 素材（logos64.json 占位）
└── references/
    ├── layouts.md           # 布局库（deck 页型 + 长页 section + 互转映射）
    ├── components.md        # 组件库（~25 个，slug 命名不重号）
    ├── checklist.md         # 通用质量清单 P0/P1/P2
    ├── scene-deck.md        # deck 场景（吸收工作 prompt 全部硬规格）
    └── scene-long.md        # 长页场景（提案式骨架+坏味道修复）
```

## 相对旧参考 skill / 工作 prompt 的改进

| 问题 | 本 skill 修复 |
|---|---|
| 旧参考 skill components.md 116K/编号重复 | 精简 ~25 个、slug 命名不重号 |
| 旧参考 skill slides 与通用规则三处矛盾 | 矛盾项下沉 scene，通用清单不再冲突 |
| 旧参考 skill template 无 scale JS | template-deck 内置 `fitStage()` |
| 旧参考 skill 导出脚本开箱即坏 | 加 `package.json` + 路径修复 |
| 旧参考 skill layouts 与 scene 两套无映射 | `layouts.md` 给 deck↔长页映射表 |
| 工作 prompt 绕开 skill | 吸收为 `scene-deck.md`，成 skill 一部分 |
| 工作 prompt 交付歧义/双源重复/无页序/无 schema | 逐项修复（见 scene-deck.md 末尾对照） |
| 早期报告产物 inspanel 联动缺失 | 模板内置联动 JS + 验收双重强制 |
| 旧长页 545 内联 style/未定义色/重复 id | template-long 全部 class 化收编 |

## 维护

- 配色/字体/气质调整：改 `brand-dna.md`，再同步两个模板与 scene。
- 新增组件：在 `components.md` 用 `## comp-<slug>` 加，更新 `layouts.md` 映射。
- 新增场景：在 `references/` 加 `scene-<name>.md`，在 `SKILL.md` 速查表加一行。

---

*维护：Claude　|　最近更新：2026-08-13*
