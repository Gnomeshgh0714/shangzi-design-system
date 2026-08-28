# Scene · Deck（16:9 数据汇报）

> 上咨汇报设计系统的**主场景**：把市场监测/洞察报告的 MD + 底表 + logo 素材，生成 16:9 自包含 HTML deck。
> 本文件**吸收并替代**原 `HTML汇报版_生成Prompt(1)(1).md`，成为该类产出的唯一规范源。原 prompt 的硬规格全部保留，并修复其 5 个设计缺陷（见末尾「缺陷修复对照」）。
> 模板起点：`assets/template-deck.html`。配色/字体见 `brand-dna.md`。

---

## 触发场景

做市场监测报告 / 洞察报告 / 数据汇报 deck / 把报告 MD 转 HTML 演示 / 多品牌多平台数据对比汇报。

---

## 📐 页面规格

| 项 | 规格 |
|---|---|
| 比例 | 16:9 |
| 逻辑画布 | **1600 × 900 px**（所有尺寸/字号/间距以绝对像素书写） |
| 缩放 | 外层 `#stage{width:1600px;height:900px;transform-origin:center center}`，JS `min(innerW*0.97/1600, innerH*0.97/900)` 做 `transform:scale()`，resize 重算 |
| 第一原则 | **版式逐像素一致，仅整页等比缩放**。禁止 vw/vh/媒体查询/百分比字号（画布内相对 1600×900 的百分比布局允许） |
| 文件 | 单 HTML 多 `<section class="slide">`，仅 `.slide.active` 显示 |
| 模板 | `assets/template-deck.html`（含 scale JS / 翻页 / 懒初始化 / inspanel 联动） |
| 字体 | `"PingFang SC","Microsoft YaHei","Noto Sans SC",-apple-system,sans-serif`；基础色 `#1A1A2E` |

页面背景 `#F0F4FA`；单页 `.slide` 白底圆角 10px + 阴影 `0 8px 40px rgba(15,23,42,.18)` + padding `10px 34px 24px`。

---

## 🎨 配色（上咨蓝梯度，替代工作 prompt 的 #1E40AF 系）

主色系见 `brand-dna.md`。数据可视化色阶**重映射到上咨蓝梯度**（原 prompt 用其自带蓝色，此处改上咨蓝，保持色阶逻辑）：

| 色组 | 色值（浅->深） |
|---|---|
| 价格段 6 色阶 SEGC | `#7AB3F5 #4A8EF2 #0E58C4 #0A3D8A #60616B #8A8A9A`；堆积图 `legend.reverse=true` |
| 产品属性 7 色 ATTRCOLOR | 属性1 `#0A3D8A`、属性2 `#0E58C4`、属性3 `#4A8EF2`、属性4 `#7AB3F5`、属性5 `#60616B`、属性6 `#94A3B8`、属性7 `#CBD5E1`（按项目实际属性填充） |
| 卖点标签 15 色 LBLC | `#0A3D8A #0E58C4 #2563EB #4A8EF2 #7AB3F5 #BFDBFE #334155 #475569 #60616B #94A3B8 #A8B8CC #CBD5E1 #DDE5EE #F4D758 #EEF2F7` |
| 平台色 | 京东 `#0E58C4`、天猫 `#4A8EF2`、抖音 `#94A3B8` |
| 热力图 ryg() | 负向红 `#EF4444` -> 中性黄 `#FACC15` -> 正向绿 `#22C55E`，输出 `rgba(r,g,b,.85)` + 字 `#1F2937`；无对应 `#F1F5F9` 底 + `#64748B` 字 |
| 数据标签 colauto() | `lum<0.62` 白字，否则 `#1A1A2E` |

实现见 `assets/chart-plugins.js`（`window.SHANGZI.SEGC/ATTRCOLOR/LBLC/ryg/colauto`）。

---

## 🔤 字号 / 字重 / 行距（逐项硬规格）

| 元素 | class | 字号 | 字重 | 行距 | 颜色 |
|---|---|---|---|---|---|
| 页面标题 | `.pgtitle` | 28 | 800 | - | `#111827`（左 6px 蓝竖条） |
| 图表标题 | `.ctitle` | 22 | 700 | - | `#334155`（居中绘图区上方，命名"××示意图"不带括注） |
| 洞察观点句 | `.ins-head` | 19.5 | 700 | 1.55 | `--blue`；`.big` 时 20 |
| 洞察要点 | `.ins-grp li` | 17 | - | 1.8 | `#374151` |
| 核心洞察标签 | `.corechip` | 14 | 700 | - | 白/底 `--blue` |
| 导航 | `.nv` | 14 | 选中600 | - | `#9CA3AF`（选中白/底蓝） |
| 切换按钮 | `.pbtn` | 17 | - | - | `#334155`（选中白/底蓝） |
| 核心发现编号 | `.kfnum` | 56 | 800 | 1.1 | `#BFDBFE` |
| 核心发现小标题 | `.kfhead` | 23 | 800 | 1.4 | `#111827` |
| 核心发现要点 | `.kflist li` | 17 | - | 1.65 | `#374151` |
| 采集页说明 | `.explain` | 15 | - | 1.6 | `#475569`（底 `#F1F5F9`，**固定高 205px**） |
| 说明清单 | `.exul` | 14 | - | - | 两栏 columns:2 |
| 图例/轴标签 | - | 16 | - | - | 默认 |
| 柱内数据标签 | - | 14 | bold | - | colauto |
| 引线外置标签 | - | 11 | bold | - | 文 `#475569`，线 `#B8C0CC` 1px |
| 脚注 | `.foot` | 11.5 | - | 1.35 | `#8B95A3` |
| 热力表（大） | `.heat td` | 14.5 | - | - | - |
| 热力表（小） | `.heat.small td` | 12.5 | - | - | - |
| 封面主标题 | `.covertext h1` | 46 | 800 | - | 白（封面用整图时不叠字） |

---

## 📝 核心排版原则

1. **内容铁律**：保留全部素材，只重组版式（最高优先级）。洞察/脚注/标题 100% 取 MD 原文含标点，禁止改写/概括/补充。
2. **一页讲透一个主题**，不是删到剩一句话。
3. **字号分级靠层级不靠删字**。
4. **结构替代堆砌**：用色块/箭头/编号/矩阵/分栏/卡片把逻辑做成版式。
5. **整页铺满**：内容区占 80% 高水平居中，不居中挤压。**每页单页完整，不允许页内滚动/裁切**。

---

## 🧩 版式结构（页型详见 layouts.md「Deck 页型」）

- **two_col（左图右洞察）**：`.cols` flex gap 22，`.c-left` flex 1.8 图表垂直居中，`.c-right` flex 1 统一洞察框。每页右栏仅一个 `.corechip`。
- **ins-topbox（上洞察下全宽图）**：洞察框全宽置顶 + 全宽图（瀑布图等宽图页）。
- **kf_page（核心发现）**：`.kfwrap` 垂直居中，多条 `.kf-item`。
- **数据采集页**：两 `.c-half` 镜像对称（图例朝中间），`.explain` 固定 205px。
- **按钮切换页**：`.pbtns` + `.panel` + `.inspanel` 联动。**`.inspanel` 的 `data-target` 必须与 `.panel` 的 `id` 一致，`showPanel()` 同步切换**（修早期报告产物 inspanel 缺失 bug）。
- **附件 2×2**：`.minigrid` 撑满至页底，每张带 `.minit` 标题 + 上方统一图例，不放洞察。

---

## 📊 图表规格（Chart.js 4.4.1，`maintainAspectRatio:false`）

通则：饼图不用 donut；不画网格线/坐标轴刻度/边框（`grid.display=false,border.display=false`）；分类轴 ticks 字号 16；图表高度用百分比撑满左栏（多数 92%）。详见原 prompt §5，按表号：

| 表号 | 类型 | 要点 |
|---|---|---|
| 表1-3 | 分组柱 | x=品牌（轴下 logo），双行标签"百分比+数量"，y 轴 `grace:'30%'` 防裁 |
| 表4 | 堆积柱 | x=品牌，段=视频/商品卡/直播 |
| 表5 | 堆积柱 | x=平台（轴下 logo），段=6 价格段 SEGC，图例 reverse |
| 表6-9 | 堆积柱 | 品牌按钮切换，x=平台，段=价格段 |
| 表15 | 堆积柱 | x=平台，段=7 属性 ATTRCOLOR |
| 表16/17 | 堆积柱 | 平台按钮，段=属性 |
| 表18 | 2×2 小图 | 附件，x=价格段堆积柱 + 上方统一图例 |
| 表23 | 堆积柱 | x=平台，段=15 卖点 LBLC，图例 reverse |
| 表24 | 热力表 | 品牌 logo 放表格最下一行 |
| 表27-29 | 水平条形 | `indexAxis:'y'`，两系列帖数占比/互动占比 |
| 表30 | 静态矩阵 | 5 行"无对应"灰底置顶 + 凑满 15 行 + 省略行，不滚动 |
| 表31 | 瀑布图 | 浮动柱 `data:[[覆盖率,需求占比]]`，标 Gap，洞察框全宽置顶 |

---

## 🏷 数据标签规则（stackLeader 插件）

- 柱内标签 14px bold，颜色 colauto。**所有数值一律显示，含 0.0%**。
- 堆积柱像素高 <12px 或 0% 段：不在柱内硬挤，用 1px 灰线 `#B8C0CC` 从段右缘引到柱右侧，外以 11px bold `#475569` 标注；同柱多标签纵向 15px 避让。
- 适用：表5/6-9/15/16/17/23（所有堆积柱系列）。对这些图 `ChartDataLabels.display=false`，由 `stackLeader` 插件独绘；`layout.padding.top≥22`。

---

## 🔌 Chart.js 插件（`assets/chart-plugins.js`）

- 内联 `chart.umd.min.js` 4.4.1 + `chartjs-plugin-datalabels` 2.2.0 + `chart-plugins.js`。
- 注册 `ChartDataLabels`、`logoAxis`、`stackLeader`。默认 `datalabels.display=false`。
- **logoAxis**：`_sliceLogos`（饼图扇区外 24px，高 32px）/ `_logos`（分类轴下，高 38px，`padding.bottom=76`）/ `_groupLogos`（成对列上方，高 30px）。
- logo 素材 base64 存 `logos64.json`，`Image` 缓存 onload 后重绘。

---

## 📥 数据来源与解析口径

- 图表数据来自洞察 MD 表格，解析为 `{表号:{title,appendix,subs:[(平台|None,行矩阵)],formula,insight:[...]}}` + `findings`。
- 识别标记：`**平台**` 子表、`> **脚注/公式**：`、`> **Insight**：`+`> -` 要点、`==高亮==`；附件表标题含「（附件）」。
- 口径：SKU 数=行数；三平台销量不可混加；7 属性定义固定；贡献度等权拆分行列加总=100%。
- **洞察/脚注/标题 100% 取 MD 原文含标点**；生成器只做展示层标点规整（核心发现「；/。」收尾、去标题句尾句号），不改措辞。

---

## 📝 MD 素材稿格式（SKILL Step 3 硬门控，未确认不写 HTML）

```markdown
# 报告标题
> 副标题 / 客户 / 日期

## P1 | 封面
- 类型：pg-cover
- 标题：封面标题
- 来源：客户 PPT 封面原图 cover.jpg

## P2 | 数据概况
- 类型：pg-data-overview
- 布局：双饼镜像
- 内容：平台 A/B SKU 分布 + 口径说明
- 来源：MD 表X
```

### logos64.json 骨架（修工作 prompt 缺 schema）
```json
{
  "jd":"data:image/png;base64,...","tm":"...","dy":"...",
  "zh":"...","xhs":"...","bl":"...",
  "brandA":"...","brandB":"...","brandC":"...","brandD":"...",
  "cover":"data:image/jpeg;base64,..."  // 封面整图
}
```
平台缩略图 112px，品牌图裁白边至 240px 宽。

### 缺表兜底（修工作 prompt 缺兜底）
- MD 缺某表：该页跳过，页序顺延，不造空页。
- MD 多某表：归入附件页（pg-minigrid 或 pg-matrix）。
- 某表行数超单页：拆为「主表 + 附件续表」，主页放 TOP N + 洞察，续表放附件。

---

## 📑 权威页序清单（修工作 prompt 缺页序）

市场监测报告标准页序（按内容裁剪，**以此为准**，不再从导航条/表号/验收三处拼凑）：
```
P1 封面 pg-cover
P2 数据概况 pg-data-overview
P3-P4 核心发现(1-2页) pg-key-findings
P5 品牌竞争 pg-switch（平台按钮）
P6 价格 pg-switch（品牌按钮，表5/6-9）
P7 产品属性 pg-switch（平台按钮，表15/16/17）
P8 卖点 pg-heatmap（表24）或 pg-switch（表23）
P9 消费者需求 pg-two-col（表27-29 水平条形）
P10 供需缺口 pg-waterfall（表31）
P11 附件 pg-minigrid（表18）+ pg-matrix（表30）+ 其他
P12 结束 pg-end
```

---

## ✅ 验收清单（deck 专属，引用上方小节，**不复述**，修工作 prompt 双源重复）

- [ ] 画布 1600×900 + scale 缩放，版式不随分辨率变化（§页面规格）
- [ ] 内容区占 80% 高水平居中；图表/洞察垂直居中（§排版原则）
- [ ] 洞察框全篇统一：灰底+描边+蓝chip+白卡片，不用异色框（§版式结构）
- [ ] 字号按§字号表执行
- [ ] logo 只在轴下/扇区旁/按钮内/表24最下行，右上角不放 logo（§图表规格/§插件）
- [ ] 图表标题居中绘图区上方，命名"××示意图"不带括注（§字号表）
- [ ] 堆积图图例 reverse，与柱内颜色自上而下一致（§配色）
- [ ] 深色柱数据标签白字 colauto（§配色）
- [ ] 所有数值显示含 0%，小值引线外置（§数据标签规则）
- [ ] 表1-3 y 轴留 30% 顶部余量防双行标签裁切（§图表规格）
- [ ] **按钮切换页图表-洞察联动 inspanel 实现**（§版式结构）--早期报告曾漏，重点验
- [ ] 每页单页完整无滚动/裁切（§排版原则）
- [ ] 封面=客户 PPT 封面原图整幅铺底不叠字（§版式结构）
- [ ] 数据采集页两饼等大镜像、说明框等高 205px（§版式结构）
- [ ] 核心发现页编号 56px 淡蓝、小标题 23px、句尾标点规范（§字号表/§组件）
- [ ] 表30 矩阵 5 行无对应置顶 + 凑 15 行 + 省略行不滚动（§图表规格）
- [ ] 表31 瀑布占满页宽、洞察全宽置顶（§图表规格）
- [ ] 表18 附件 2×2 撑满 + 统一图例 + 数据标签，不放洞察（§图表规格）
- [ ] 洞察/脚注/标题 100% 取 MD 原文（§数据来源）
- [ ] 导出 PDF 按钮切换页逐面板单独成页（§交付纪律）

---

## 📤 交付纪律

- **直接产出自包含单 HTML 文件**（修工作 prompt 交付形态歧义：`gen_deck2.py` 仅标注为可选辅助，默认直接写 HTML）。
- 每次修改另存 v2/v3，绝不覆盖；怀疑没改先 md5 比对 MD。
- 不用 `localStorage/sessionStorage`（制品环境不支持）。
- `</body>` 前注入 `editable-layer.html`（浏览器内编辑 + 导出 PDF + 保存 HTML）。
- 额外导出（skill 目录运行）：`node generate_pdf.cjs <deck.html> [--png]` 出 PDF/逐页 PNG；`node convert_pptx.cjs <deck.html> --page 3` 单页转可编辑 PPTX。

---

## 🔧 缺陷修复对照（本文件 vs 原 prompt）

| 原 prompt 缺陷 | 本文件修复 |
|---|---|
| 交付形态歧义（HTML vs gen_deck2.py） | 明确默认直接写 HTML，gen_deck2.py 标可选 |
| §1-10 与 §11 双源重复 | 验收清单改为引用小节号，不复述 |
| 缺权威页序 | 新增「权威页序清单」单段 |
| MD/JSON schema 未显式 | 给 MD 素材稿格式 + logos64.json 骨架 + 缺表兜底 |
| 验收不可机器化 | 给可断言项（画布 1600×900、每页无滚动、inspanel 联动存在、数据标签含 0%） |
| inspanel 联动未强制 | 版式结构 + 验收双重强调，模板已内置联动 JS |
| 配色用旧工作 prompt 蓝 #1E40AF（与上咨 PPT 不一致） | 重映射为上咨蓝梯度 #0E58C4 系 |
