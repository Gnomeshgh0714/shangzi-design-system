# 组件库 · shangzi-design-system

> 可复用组件清单。**用 slug 命名，不编号**（避免旧参考 skill components.md 编号重复导致取错）。
> CSS 已在两个模板（`template-deck.html` / `template-long.html`）的 `<style>` 内定义；本文件给 HTML 骨架 + 关键规则 + 适用场景，生成时从对应模板拷贝起步、选组件填充。
> 硬规则：**禁止使用 HTML 默认样式**（裸 `<ul>/<table>/<blockquote>` 必须带下列 class）。

---

## 一、Deck 组件（16:9 / 1600×900）

### comp-insight-box · 核心洞察框
**场景**：two_col 右栏、ins-topbox 置顶、热力表右栏。全篇统一样式，每页仅一个。
```html
<div class="ins-box">
  <span class="corechip">核心洞察</span>
  <div class="c-right-inner">
    <ul class="ins-grp">
      <li class="ins-head">观点句取 MD 原文</li>
      <li>要点一；</li><li>要点二。</li>
    </ul>
  </div>
</div>
```
**规则**：灰底 `#F8FAFC` + 描边 `#E2E8F0` + 蓝 chip + 白卡片；洞察文字垂直居中；不用异色框。

### comp-kf-item · 核心发现条
**场景**：核心发现页（kf_page）。编号 56px 淡蓝 + 小标题 23px + 要点 17px。
```html
<div class="kf-item">
  <div class="kfnum">01</div>
  <div><div class="kfhead">小标题不带句号</div>
    <ul class="kflist"><li>要点；</li><li>要点。</li></ul></div>
</div>
```
**规则**：小标题末尾不带句号；要点除最后一行「。」外一律「；」。

### comp-switch-panel · 按钮切换组（图表-洞察联动）
**场景**：品牌竞争/价格/属性/卖点等多品牌/平台对比页。**inspanel 必须与 panel 联动**（修早期报告产物 bug）。
```html
<div class="pbtns">
  <button class="pbtn on" data-target="pnl-1">品牌 A</button>
  <button class="pbtn" data-target="pnl-2">品牌 B</button>
</div>
<div class="c-left">
  <div class="panel show" id="pnl-1"><canvas id="chart-1"></canvas></div>
  <div class="panel" id="pnl-2"><canvas id="chart-2"></canvas></div>
</div>
<div class="c-right">
  <div class="ins-box"><span class="corechip">核心洞察</span>
    <div class="c-right-inner">
      <div class="inspanel show" data-target="pnl-1"><ul class="ins-grp"><li class="ins-head">品牌 A 观点</li></ul></div>
      <div class="inspanel" data-target="pnl-2"><ul class="ins-grp"><li class="ins-head">品牌 B 观点</li></ul></div>
    </div>
  </div>
</div>
```
**规则**：`.inspanel` 的 `data-target` 必须与对应 `.panel` 的 `id` 一致；JS 的 `showPanel()` 同步切换两者。

### comp-heat · 热力表
**场景**：品牌×卖点贡献度、价格段×属性等红黄绿编码表。
```html
<table class="heat">
  <thead><tr><th>维度</th><th>列 A</th><th>列 B</th></tr></thead>
  <tbody>
    <tr><td>行 1</td><td style="background:rgba(34,197,94,.85);">12.6%</td><td style="background:rgba(239,68,68,.85);">3.2%</td></tr>
  </tbody>
</table>
```
**规则**：单元格底色用 `ryg(v,vmin,vmax)` 生成（`rgba(r,g,b,.85)` + 字 `#1F2937`）；无对应用 `#F1F5F9` 底 + `#64748B` 字；单页完整无内部滚动。

### comp-data-collect · 数据采集双饼
**场景**：数据概况页。两饼图镜像对称（图例朝中间），下方说明框固定 205px 高。
```html
<div class="cols">
  <div class="c-half"><div class="ctitle">平台 A 示意图</div><canvas id="pie-a"></canvas>
    <div class="explain"><ul class="exul"><li>口径要点</li></ul></div></div>
  <div class="c-half"><div class="ctitle">平台 B 示意图</div><canvas id="pie-b"></canvas>
    <div class="explain"><ul class="exul"><li>口径要点</li></ul></div></div>
</div>
```

### comp-minigrid · 2×2 小图（附件）
**场景**：附件多品牌对比。撑满至页底，每张带标题，上方统一图例，不放洞察文字。
```html
<div class="minigrid">
  <div><div class="minit">品牌 A</div><canvas id="mini-1"></canvas></div>
  <div><div class="minit">品牌 B</div><canvas id="mini-2"></canvas></div>
  <div><div class="minit">品牌 C</div><canvas id="mini-3"></canvas></div>
  <div><div class="minit">品牌 D</div><canvas id="mini-4"></canvas></div>
</div>
```

### comp-pgtitle · 页面标题
```html
<div class="pgtitle">页面标题</div>
```
**规则**：28px/800，左侧 6px 蓝竖条，`padding-left:12px`。

### comp-nav · 顶部导航条
```html
<div class="nvbar"><button class="nv">封面</button><button class="nv on">当前章</button><button class="nv">下一章</button></div>
```
**规则**：当前章蓝底白字 600，其余灰；药丸圆角 14px。

### comp-cover · 封面整图
```html
<section class="slide bare"><div class="cover" style="background-image:url('assets/logos/cover.jpg');"></div></section>
```
**规则**：整版 PPT 封面原图铺底，`background-size:cover`，不叠 HTML 文字。

### comp-dark-panel-deck · deck 暗色面板
**场景**：公式/重点声明/对比强调。
```html
<div class="dark-panel"><div class="ins-head" style="color:var(--yellow);">重点标题</div><p>内容</p></div>
```

---

## 二、长页组件（滚动式）

### comp-kicker-title · 标题三件套
**场景**：每个 section 的标题区。
```html
<div class="kicker">English Label</div>
<h2 class="s-title">中文标题 <span class="hl">高亮词</span> 与 <span class="b">蓝词</span></h2>
<p class="lead">导语，浅灰大行距。</p>
```
**规则**：kicker=Fraunces 斜体+黄短线；s-title=Noto Serif SC 900；`.hl`=黄底高亮，`.b`=蓝色。

### comp-flywheel · 封面飞轮
**场景**：封面/理念页。conic-gradient 旋转环 + 四方位节点。见 `template-long.html` P1。
**规则**：`.fw-ring` 用 `conic-gradient` + `mask` 做空心环，`@keyframes spin` 旋转；四节点 `position:absolute` + `top/left` 百分比定位。

### comp-pyramid · 层级金字塔
**场景**：Skill 层级/组织层级/能力层级。倒梯形靠 `width:60%->75%->90%` 递增 + 渐变由深到浅。
```html
<div class="pyramid">
  <div class="pyr-tier"><div class="lvl">Level 1</div><div class="ttl">顶层</div><div class="chips"><span>标签</span></div></div>
  <div class="pyr-arrow">▼</div>
  <div class="pyr-tier t2"><div class="lvl">Level 2</div><div class="ttl">中层</div></div>
  <div class="pyr-arrow">▼</div>
  <div class="pyr-tier t3"><div class="lvl">Level 3</div><div class="ttl">底层</div></div>
</div>
```

### comp-org-chart · 三层组织架构图
**场景**：组织全景。纵向 flex-column 堆叠三层面板，层间 `.org-connector` 连线。
```html
<div class="org-chart">
  <div class="org-tier">
    <div class="tier-label">第一层</div>
    <div class="tier-body">
      <div class="org-node org-node--deep"><div class="ico">👤</div><div class="nm">节点名</div></div>
      <div class="org-node org-node--blue"><div class="ico">🤖</div><div class="nm">节点名</div></div>
    </div>
  </div>
  <div class="org-connector"></div>
  <!-- 重复二、三层 -->
</div>
```
**规则**：`.tier-label` 用 `writing-mode:vertical-rl` 竖排；节点配色 `--blue/--deep/--yellow` 三态。

### comp-timeline-h · 水平时间轴
**场景**：实施阶段/路线图。grid 3 列 + `::before` 渐变连线 + phase-dot。
```html
<div class="timeline-h">
  <div class="phase-col"><div class="phase-dot">壹</div>
    <div class="phase-card"><div class="ph-name">阶段</div><div class="ph-nature">性质</div>
      <div class="role-line"><span class="who">角色</span><span>职责</span></div></div></div>
  <!-- ×3 -->
</div>
```
**规则**：每列 `:nth-child` 用不同 dot 边框色（蓝梯度三阶）。

### comp-step-block · 步骤递进
**场景**：三段递进（信息化/数字化/智能化等）。grid 3 列 + 圆点。
```html
<div class="step-block">
  <div class="step-item"><div class="st-num">01</div><h4>标题</h4><p>说明</p></div>
  <!-- ×3 -->
</div>
```

### comp-formula-box · 公式框（暗色）
**场景**：核心命题/公式/指标。
```html
<div class="formula-box"><p>文字说明</p><div class="formula">C = S / (S + C)</div>
  <div class="sub-kpi"><div class="kpi"><div class="v">值</div><div class="l">标签</div></div></div></div>
```
**规则**：`--dark-panel` 底，公式用 Fraunces + 暖黄。

### comp-tag · 标签系统
```html
<span class="tag">实心蓝标签</span>
<span class="tag tag--ghost">描边标签</span>
```

### comp-box-cards · 卡片网格
**场景**：多要点并列。`.cols-2/.cols-3/.cols-6` 栅格 + `.box` 卡片。
```html
<div class="grid cols-3">
  <div class="box box-blue"><div class="kw">关键词</div><div class="desc">说明</div></div>
  <div class="box box-yellow"><div class="kw">关键词</div><div class="desc">说明</div></div>
  <div class="box box-deep"><div class="kw">关键词</div><div class="desc">说明</div></div>
</div>
```

### comp-big-ghost · 装饰大字
**场景**：section 背景锚点。
```html
<div class="big-ghost">01</div>
```
**规则**：绝对定位、Fraunces、`opacity:.08`、`pointer-events:none`。

### comp-sidenav · 侧边导航 + 进度条
**场景**：长页固定右侧圆点导航 + 顶部进度条。JS 自动构建（见 `template-long.html` script）。

### comp-sec-containers · Section 容器
```html
<section class="sec" id="p1" data-label="封面"><div class="wrap">...</div></section>
<section class="sec sec--alt" id="p2" data-label="命题"><div class="wrap">...</div></section>
<section class="sec sec--dark" id="p3" data-label="考核"><div class="wrap">...</div></section>
```
**规则**：`.sec--alt`=浅蓝交替底，`.sec--dark`=蓝系深底；每个 section 布局必须不同；`data-label` 供侧边导航读取。

---

## 三、通用 SVG 图标规范

不用 emoji（跨平台渲染不一致）。统一用内联 SVG，单色描边跟随 `currentColor`：
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
</svg>
```
常用图标：人 `👤`、机器人 `🤖`、公文包 `💼`、图表 `📊` 等全部替换为对应 SVG。

---

*新增组件时：用 `## comp-<slug>` 命名，给 HTML 骨架 + 关键 CSS + 适用场景。不要复用编号。*
