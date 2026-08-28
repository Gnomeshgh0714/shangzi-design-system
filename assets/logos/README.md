# logos 素材目录

deck 场景的 logo/封面素材存放处。两种方式：

## 方式一：logos64.json（推荐，base64 内联）
把所有 logo 编成 base64 写入 `logos64.json`，生成时读入内联，保证单文件自包含。
骨架见 `references/scene-deck.md`「logos64.json 骨架」：
```json
{
  "jd":"data:image/png;base64,...","tm":"...","dy":"...",
  "zh":"...","xhs":"...","bl":"...",
  "brandA":"...","brandB":"...","brandC":"...","brandD":"...",
  "cover":"data:image/jpeg;base64,..."
}
```
- 平台缩略图 112px，品牌图裁白边至 240px 宽。
- key 约定：平台 `jd/tm/dy/zh/xhs/bl`，品牌 `brandA/brandB/brandC/brandD`（按项目实际品牌命名），封面 `cover`。

## 方式二：直接放图片文件
把 `cover.jpg`、`end.jpg`、各 logo png 放本目录，模板里用相对路径 `assets/logos/cover.jpg` 引用（非自包含，适合本地预览）。

> 正式交付优先方式一（自包含）。本目录当前为占位，按项目实际素材填充。
