# library/ · 模板素材库

> 本目录是 skill 的**可扩展资产层**：同事/业务方可以把自己的模板与素材放进来，skill 会优先使用。
> 与 `assets/`（内置出厂资产）的关系：`library/` 优先，`assets/` 兜底。

## 目录约定

| 子目录 | 放什么 | skill 怎么用 |
|---|---|---|
| `templates/` | 自制/客户认可的 deck HTML 模板（必须与上咨骨架同构：`#deck>#stage>.slide` + 同套 CSS 变量） | 阶段 4 生成时**优先选用**（按文件名取最新，或用户指定）；入库前必须过 `node scripts/validate-deck.cjs` 的骨架与禁色检查 |
| `exemplars/` | 过往优秀成品 deck（客户表扬过的、领导认可的） | 作为风格参照样本：agent 生成前可 Read 其结构学习「好的样子」，但**不得复制其内容** |
| `logos/` | 客户/品牌 logo 图片、封面底图 | 封面/页脚引用；建议同时备 base64 内联版（`logos64.json`）保证单文件交付 |

## 入库规则（模板进 templates/ 前）

1. 跑 `node ../scripts/validate-deck.cjs <模板.html>`，骨架/禁色/裸标签必须全过（内容保真项可忽略，模板无素材）。
2. 模板里的示例文案应换成占位符（如「此处为页标题」），避免占位文案混入成品。
3. 命名建议：`模板名-日期.html`（如 `某专项-模板-20260820.html`）。

## 与 Web 版的关系

Web 版（`distribution/`）的「使用者自主上传模板」功能（`SZTemplate.setCustom/getTemplate`）与本目录同一设计：都是「模板可替换、生成器不变」。本目录是 CLI 形态的落地。
