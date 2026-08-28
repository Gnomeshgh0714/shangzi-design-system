#!/usr/bin/env bash
# ============================================================
# shangzi-design-system · 一键安装
# 把 skill 与 3 个 agent 安装到当前用户的 Claude Code (~/.claude/)
# 用法：在 skill 根目录执行  bash install.sh
# ============================================================
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
AGENTS_DIR="$HOME/.claude/agents"
SKILL_NAME="shangzi-design-system"

echo "==> 安装 $SKILL_NAME"
echo "    源目录: $SRC"

# 依赖检查：node（validate-deck.cjs 需要）
if ! command -v node >/dev/null 2>&1; then
  echo "    [警告] 未检测到 node。P0 机械校验脚本需要 Node.js（>=18）。"
  echo "    请先安装 Node 再继续，或安装后手动运行校验。"
fi

# Claude Code 目录
if ! command -v claude >/dev/null 2>&1 && [ ! -d "$HOME/.claude" ]; then
  echo "    [警告] 未检测到 ~/.claude 或 claude CLI，仍将创建目录并安装。"
fi
mkdir -p "$SKILLS_DIR" "$AGENTS_DIR"

# --- 1. 安装 skill ---
TARGET="$SKILLS_DIR/$SKILL_NAME"
if [ -L "$TARGET" ] || [ -e "$TARGET" ]; then
  echo "==> 检测到已存在的 $TARGET，先移除旧版"
  rm -rf "$TARGET"
fi

# 优先软链（源目录在外置磁盘时保持单一真源），失败则复制
if ln -s "$SRC" "$TARGET" 2>/dev/null; then
  echo "    skill 已软链: $TARGET -> $SRC"
else
  cp -R "$SRC" "$TARGET"
  echo "    skill 已复制: $TARGET"
fi

# --- 2. 安装 agents ---
echo "==> 安装 3 个 agent 到 $AGENTS_DIR"
for f in "$SRC"/agents/*.md; do
  base="$(basename "$f")"
  cp "$f" "$AGENTS_DIR/$base"
  echo "    agent 已安装: $base"
done

echo ""
echo "==> 校验 P0 脚本可运行"
if command -v node >/dev/null 2>&1; then
  node "$SRC/scripts/validate-deck.cjs" --help >/dev/null 2>&1 \
    && echo "    validate-deck.cjs OK" \
    || echo "    [提示] validate-deck.cjs --help 返回非 0，请手动检查"
else
  echo "    [跳过] node 未安装"
fi

echo ""
echo "============================================================"
echo "安装完成。"
echo "  skill  : $TARGET"
echo "  agents : $AGENTS_DIR/shangzi-{content-editor,deck-builder,qa-validator}.md"
echo ""
echo "使用：在 Claude Code 里直接说「用 shangzi-design-system 帮我做个汇报 deck」"
echo "      或命中触发词（做 HTML 汇报 / 做 deck / 把 MD 转 HTML 演示 …）。"
echo "详见：使用指南-同事版.md"
echo "============================================================"
