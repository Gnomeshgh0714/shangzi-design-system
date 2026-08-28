# 布局库 · shangzi-design-system

> 统一的布局体系。旧参考 skill 把 layouts.md（长页 15 布局）与 scene-slides.md（16 页型）拆成两套无映射的体系，本文件**合并并给映射**，消除「做 slides 该读哪个」的困惑。
> deck 用「页型」（16:9 单页布局），长页用「section 布局」（滚动 section 内部布局）。同一内容两种形态可互转。

---

## 一、Deck 页型（16:9 / 1600×900，每页一个 `.slide`）

每页 = `.head`（标题区）+ `.body`（主体，占 80% 高）+ `.foot`（脚注）。主体内选一种页型：

| 页型 slug | 用途 | 主体结构 | 用哪个组件 |
|---|---|---|---|
| `pg-cover` | 封面 | 整图铺底，不叠字 | comp-cover |
| `pg-data-overview` | 数据概况 | 双饼镜像 + 说明框 | comp-data-collect |
| `pg-key-findings` | 核心发现 | kfwrap 垂直居中，多条 kf-item | comp-kf-item |
| `pg-two-col` | 图-洞察主版式 | 左图右洞察，flex 1.8:1 | comp-insight-box |
| `pg-switch` | 按钮切换多对比 | pbtns + panel + inspanel 联动 | comp-switch-panel |
| `pg-topbox` | 上洞察下全宽图 | ins-topbox 置顶 + 全宽图 | comp-insight-box |
| `pg-heatmap` | 热力表 | 左表右洞察 | comp-heat |
| `pg-minigrid` | 2×2 小图（附件） | grid 2×2 撑满 | comp-minigrid |
| `pg-matrix` | 静态匹配矩阵 | 表格 + 右洞察，无滚动 | comp-heat 变体 |
| `pg-waterfall` | 瀑布图 | 全宽图 + 置顶洞察 | comp-insight-box |
| `pg-end` | 结束页 | 整图铺底 | comp-cover |

**deck 页序（市场监测报告权威清单，可按内容裁剪）**：
封面 → 数据概况 → 核心发现(1-2 页) → 品牌竞争 → 价格 → 产品属性 → 卖点 → 消费者需求 → 供需缺口 → 附件 → 结束。

---

## 二、长页 section 布局（滚动式，每个 `.sec` 一种）

每个 section = `.kicker` + `.s-title` + `.lead` + 主体。主体选一种布局：

| section 布局 slug | 用途 | 主体结构 | 用哪个组件 |
|---|---|---|---|
| `sec-hero-flywheel` | 封面/理念 | 飞轮 + 右侧文字 | comp-flywheel |
| `sec-dark-formula` | 命题/公式 | 暗色面板 + 公式 + sub-kpi | comp-formula-box |
| `sec-step-progression` | 三段递进 | step-block 3 列 | comp-step-block |
| `sec-org-chart` | 组织全景 | 三层纵向架构 | comp-org-chart |
| `sec-pyramid` | 层级体系 | 倒金字塔 | comp-pyramid |
| `sec-timeline` | 实施阶段 | 水平时间轴 3 列 | comp-timeline-h |
| `sec-card-grid` | 多要点并列 | cols-2/3/6 + box 卡片 | comp-box-cards |
| `sec-dark-kpi` | 考核收尾 | 暗色 + sub-kpi 横排 | comp-formula-box 变体 |
| `sec-quote` | 金句引用 | 大引号 + 居中金句 | (自定义，参考旧参考 skill quote) |
| `sec-compare` | 左右对比 | 双栏 VS | (自定义，左蓝右灰) |

**长页节奏**：`.sec`(白) → `.sec--alt`(浅蓝) → `.sec`(白) → `.sec--dark`(深蓝) 交替，避免连续同底色。每个 section 布局必须不同。

---

## 三、Deck 页型 ↔ 长页 section 布局 映射

同一内容从 deck 转长页（或反之）时，按此映射：

| 内容意图 | deck 页型 | 长页 section 布局 |
|---|---|---|
| 理念/封面 | pg-cover | sec-hero-flywheel |
| 核心命题/公式 | pg-two-col（图换公式） | sec-dark-formula |
| 三段递进 | pg-two-col（左图换三步） | sec-step-progression |
| 组织架构 | pg-two-col（左图换架构） | sec-org-chart |
| 层级体系 | pg-two-col（左图换金字塔） | sec-pyramid |
| 实施阶段 | pg-two-col（左图换时间轴） | sec-timeline |
| 多要点对比 | pg-switch 或 pg-minigrid | sec-card-grid |
| 核心考核 | pg-key-findings | sec-dark-kpi |
| 数据图-洞察 | pg-two-col | sec-card-grid（图+洞察卡） |
| 热力/矩阵 | pg-heatmap / pg-matrix | sec-card-grid（表+洞察卡） |

**规则**：deck 转 long 时，每页型 → 一个 section；long 转 deck 时，每个 section → 一页 slide（内容过多则拆多页，不挤压）。

---

## 四、布局选用原则

1. **每页/每 section 布局必须不同**--相邻页/section 不重复同一 slug。
2. **整页铺满，不居中挤压**--deck 内容区占 80% 高水平居中；长页 `.wrap` max-width 1280。
3. **结构替代堆砌**--用色块/箭头/编号/矩阵/分栏/卡片把逻辑关系做成版式，不靠纯文字堆砌。
4. **字号分级靠层级不靠删字**--信息密度高是优点，用字号梯度表达层级，不删内容。
5. **deck 单页完整无滚动**--内容多了拆页，不允许页内滚动条或裁切。

---

*新增布局时：给 slug + 用途 + 主体结构 + 用哪个组件，并更新映射表。*
