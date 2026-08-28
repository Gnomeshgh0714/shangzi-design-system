/* ============================================================
  上咨汇报设计系统 · Chart.js 自定义插件与工具函数
  吸收自工作 prompt（HTML汇报版生成Prompt §6/§7），适配上咨蓝梯度。
  依赖：Chart.js 4.4.1 + chartjs-plugin-datalabels 2.2.0
  引入：在 template-deck.html 启用 Chart.js 脚手架后 <script src="chart-plugins.js">
============================================================ */
(function () {
  if (typeof Chart === 'undefined') { console.warn('[shangzi] Chart.js 未加载，插件未注册'); return; }

  /* ===== 颜色工具 ===== */
  // hex -> {r,g,b}
  function hex2rgb(hex) {
    hex = String(hex).replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  // 亮度：按色块亮度自动选黑/白文字（lum<0.62 白字，否则墨色）
  function lum(hex) {
    const { r, g, b } = hex2rgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  function colauto(hex) { return lum(hex) < 0.62 ? '#ffffff' : '#1A1A2E'; }

  // 热力图红->黄->绿插值（负向红 #EF4444 -> 中性黄 #FACC15 -> 正向绿 #22C55E）
  // 返回 {background, color}，v 越接近 vmax 越绿，越接近 vmin 越红
  function ryg(v, vmin, vmax) {
    if (v == null || isNaN(v) || v === Infinity) {
      return { background: '#F1F5F9', color: '#64748B' }; // 无对应/∞
    }
    let t = (v - vmin) / (vmax - vmin);
    t = Math.max(0, Math.min(1, t));
    const red = [239, 68, 68], yel = [250, 204, 21], grn = [34, 197, 94];
    let c;
    if (t < 0.5) {
      const k = t / 0.5;
      c = red.map((x, i) => Math.round(x + (yel[i] - x) * k));
    } else {
      const k = (t - 0.5) / 0.5;
      c = yel.map((x, i) => Math.round(x + (grn[i] - x) * k));
    }
    return { background: `rgba(${c[0]},${c[1]},${c[2]},.85)`, color: '#1F2937' };
  }

  /* ===== 上咨蓝色阶映射（替代工作 prompt 的 SEGC/ATTRCOLOR/LBLC）===== */
  // 价格段 6 色阶（浅->深，蓝色梯度优先）
  const SEGC = ['#7AB3F5', '#4A8EF2', '#0E58C4', '#0A3D8A', '#60616B', '#8A8A9A'];
  // 产品属性 7 色
  const ATTRCOLOR = ['#0A3D8A', '#0E58C4', '#4A8EF2', '#7AB3F5', '#60616B', '#94A3B8', '#CBD5E1'];
  // 卖点标签 15 色（蓝梯度为主，暖黄穿插）
  const LBLC = [
    '#0A3D8A', '#0E58C4', '#2563EB', '#4A8EF2', '#7AB3F5',
    '#BFDBFE', '#334155', '#475569', '#60616B', '#94A3B8',
    '#A8B8CC', '#CBD5E1', '#DDE5EE', '#F4D758', '#EEF2F7'
  ];

  /* ===== logoAxis 插件：在坐标轴/扇区/分组列画 logo =====
     用法：Chart 配置里挂 _logos / _sliceLogos / _groupLogos（数组，元素 {src, x, y, ...}）
     或在 dataset/logoAxis 配置里给 logo base64。layout.padding.bottom 需 ≥76 给轴下 logo 留位。
  */
  const logoAxis = {
    id: 'logoAxis',
    afterDraw(chart) {
      const { ctx } = chart;
      const cfg = chart.config.options || {};
      // 1) 分类轴下 logo（_logos：每个刻度下画品牌/平台 logo，高 38px，最大宽 140px）
      if (cfg._logos && chart.scales.x) {
        const xs = chart.scales.x;
        xs.getTickMark && xs.ticks.forEach((t, i) => {
          const logo = cfg._logos[i];
          if (!logo) return;
          const x = xs.getPixelForTick(i);
          const img = logo._img || (logo._img = Object.assign(new Image(), { src: logo.src }));
          drawImgContain(ctx, img, x, chart.chartArea.bottom + 26, 140, 38);
        });
      }
      // 2) 饼图扇区旁 logo（_sliceLogos：扇区中心角外 24px，高 32px）
      if (cfg._sliceLogos && chart.config.type === 'pie') {
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach((arc, i) => {
          const logo = cfg._sliceLogos[i];
          if (!logo) return;
          const mid = (arc.startAngle + arc.endAngle) / 2;
          const r = arc.outerRadius + 24;
          const cx = arc.x + Math.cos(mid) * r;
          const cy = arc.y + Math.sin(mid) * r;
          const img = logo._img || (logo._img = Object.assign(new Image(), { src: logo.src }));
          drawImgContain(ctx, img, cx - 16, cy - 16, 32, 32);
        });
      }
      // 3) 成对列上方 logo（_groupLogos：高 30px）
      if (cfg._groupLogos && chart.scales.x) {
        cfg._groupLogos.forEach((g, i) => {
          if (!g) return;
          const x = chart.scales.x.getPixelForTick(g.tickIndex);
          const img = g._img || (g._img = Object.assign(new Image(), { src: g.src }));
          drawImgContain(ctx, img, x, chart.chartArea.top - 36, 60, 30);
        });
      }
      // img 异步加载后重绘
      if (chart._logoRedraw) return;
      chart._logoRedraw = true;
      requestAnimationFrame(() => { chart._logoRedraw = false; chart.draw(); });
    }
  };

  // 按包含比例画图（不拉伸变形）
  function drawImgContain(ctx, img, cx, top, maxW, h) {
    if (!img.complete || !img.naturalWidth) return;
    const w = Math.min(maxW, img.naturalWidth * (h / img.naturalHeight));
    ctx.drawImage(img, cx - w / 2, top, w, h);
  }

  /* ===== stackLeader 插件：堆积柱小值引线外置标注 =====
     用法：Chart 配置挂 _stackLeader:true，本插件接管这些图的数据标签绘制
     （对这些图关闭 chartjs-datalabels：display=false）。
     规则：柱内像素高 <12px 或 0% 段，用 1px 灰线 #B8C0CC 从段右缘引到柱右侧，
     外面以 11px bold #475569 标注；同柱多标签纵向 15px 避让。
     给这些图 layout.padding.top ≥ 22。
  */
  const stackLeader = {
    id: 'stackLeader',
    afterDatasetsDraw(chart) {
      const cfg = chart.config.options || {};
      if (!cfg._stackLeader) return;
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data.length) return;
      const barsPerGroup = meta.data.length; // 简化：按 dataset 数
      // 遍历每个柱（index），收集各 dataset 段
      const groupCount = meta.data[0]?.$context?.parsed?.x !== undefined ? chart.data.labels.length : meta.data.length;
      for (let i = 0; i < chart.data.labels.length; i++) {
        let yOffset = 0;
        const barX = meta.data[i]?.x;
        const barRight = barX + (meta.data[i]?.width || 20) / 2;
        chart.data.datasets.forEach((ds, di) => {
          const val = ds.data[i];
          if (val == null) return;
          const rect = meta.controller?.getDatasetMeta?.(di)?.data?.[i];
          // 像素高估算：用 chartArea 与 max 比例
          const pixH = Math.abs((val / chart.scales.y.max) * (chart.chartArea.bottom - chart.chartArea.top));
          if (pixH < 12) {
            const y = rect ? (rect.y + (val >= 0 ? 0 : pixH)) : chart.chartArea.bottom - yOffset;
            // 引线
            ctx.strokeStyle = '#B8C0CC'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(barRight, y);
            ctx.lineTo(barRight + 14, y);
            ctx.stroke();
            // 标注
            ctx.fillStyle = '#475569'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
            ctx.fillText((val * 100).toFixed(1) + '%', barRight + 16, y + 4);
            yOffset += 15;
          }
        });
      }
    }
  };

  /* ===== 注册 ===== */
  if (typeof ChartDataLabels !== 'undefined') Chart.register(ChartDataLabels);
  Chart.register(logoAxis, stackLeader);
  Chart.defaults.plugins.datalabels = Chart.defaults.plugins.datalabels || {};
  Chart.defaults.plugins.datalabels.display = false; // 默认关，按图开启

  /* ===== 导出工具到全局，供生成时调用 ===== */
  window.SHANGZI = { colauto, lum, ryg, hex2rgb, SEGC, ATTRCOLOR, LBLC };
})();
