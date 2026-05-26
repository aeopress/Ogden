# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Notes that complement Claude Code's built-in guidance. Apply to code work; for non-code tasks (writing, docs, design), use judgment.

## Stop when confused

If a request is ambiguous, name what is unclear and ask. Do not pick an interpretation silently. This applies *before* writing code, not after the fact.

## Every changed line should trace to the request

Before reporting done, re-read your own diff. If a line does not directly serve the user's stated goal, remove it. This is the working definition of "surgical changes."

## Loop on declarative goals

When the user gives a verifiable end state (tests pass, output matches, lint clean, benchmark below X), drive toward it autonomously. When they give imperative steps, follow them.

If the request is imperative but an obvious success criterion exists, propose the declarative version first ("I can verify this by Y — okay to drive toward that?") rather than guessing.

Users can invoke this reframing explicitly with the `dec` slash command: `/dec <request>` when installed standalone, or `/andrej-karpathy-skills:dec <request>` when installed via the plugin. See README for install options.

## 程式碼結構查詢路由

優先順序（從上到下匹配）：

1. **概念性 / 自然語言提問**（「X 怎麼實作的？」「Y 邏輯在哪？」）
   → 用 Semble MCP

2. **特定語法結構**（「找所有沒帶 deps 的 useEffect」「找所有 try/catch 沒處理的 await」）
   → 用 `sg run -p '<pattern>' -l <lang>`

3. **Call graph / impact / API 路由**（若已裝 CodeGraph）
   - 「改這個 function 會影響哪？」 → `codegraph_impact`
   - 「誰呼叫 X？」「X 呼叫了誰？」 → `codegraph_callers` / `codegraph_callees`
   - 「這個 URL endpoint 的 handler 在哪？」（Django / Express / FastAPI / Rails 等）→ `codegraph_search`

4. **精準符號操作 / rename / 跨檔 refactor**（若已裝 Serena）
   → 用 Serena MCP（`find_symbol` / `find_referencing_symbols` / `replace_symbol_body`）

5. **純字串 / regex**
   → 用 `rg`（最快、最後手段也最常用）

禁忌：
- 不要先 `rg` 再 `Read` 一堆檔案找概念——直接問 Semble。
- 不要用 `rg` 找符號定義或呼叫者，會被註解 / 字串 / 相似命名誤判。
- 不要用 `rg` 估算「改 X 影響範圍」——用 CodeGraph 的 `codegraph_impact` 才精準。

CodeGraph vs Serena 取向：CodeGraph 偏「讀取分析」（callers / impact），Serena 偏「寫入操作」（rename / replace）。沒裝的工具自動跳過該層、回退到下一層。
