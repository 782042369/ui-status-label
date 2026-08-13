# PR: Add optional `conversationStatus` provider for the running-turn status text

> 中文摘要：给 ui-conversation 的聊天视图加一个**可选状态文案服务**（`conversationStatus`），让第三方插件可以自定义智能体运行期间的状态文字（当前硬编码为 `Deep diving...`）。方案完全镜像官方已有的 `chatFileMentions` 可选服务模式，服务缺席时行为不变。

---

## Title

feat(ui-conversation): expose the running-turn status text through an optional `conversationStatus` service

## Summary

The chat view's `TurnStatus` hard-codes the label `Deep diving...`. This change lets a plugin provide the label through an optional `conversationStatus` service — the same optional-service convention the view already uses for `chatFileMentions` — and falls back to a built-in default when no provider is composed in. Behavior is unchanged with no plugin installed.

## Motivation

Third-party plugins (for example the community `dsh-ui-status-label` plugin) want to let users customize the text shown while a turn runs (first-token wait, tool execution, streaming). Today that text is a hard-coded literal, so the only way to change it from a plugin is fragile DOM rewriting. A data-flow seam removes the need for that: the view asks an optional provider for the label and renders whatever it returns.

## Changes

- **`packages/client/ui-conversation/src/client/contract/slots.ts`**
  - `DEFAULT_STATUS_LABEL` constant (default `小难梁在0721`).
  - `ConversationStatus` interface (`label(): string`) + `ctx.conversationStatus` optional Context merge, next to the existing `chatFileMentions` declaration.
- **`packages/client/ui-conversation/src/client/chat/ChatView.tsx`**
  - `TurnStatus` accepts a `statusLabel` prop and renders it instead of the hard-coded literal; the view resolves it from the optional service with the built-in default.
- **`packages/client/ui-conversation/src/client/apply.ts`**
  - The chat-view inject reads `ctx.get('conversationStatus')?.label() ?? DEFAULT_STATUS_LABEL` (lazy, per call — same pattern as the `fileMentions` inject line).
- **`packages/client/ui-conversation/src/client/index.ts`**
  - Exports `ConversationStatus` and `DEFAULT_STATUS_LABEL` for provider authors.

## Design notes

- Mirrors the existing `chatFileMentions` optional-service convention (provider via `ctx.provide`, consumer via `ctx.get`), so the seam is a documented pattern rather than a new mechanism.
- Absent provider → built-in default, byte-for-byte the current behavior. The service is structurally typed, so providers need no shared runtime identity.
- An upstream provider label makes any DOM-fallback injector in existing plugins inert automatically (the text no longer equals the hard-coded fallback).

## Testing

Tests are included in `UPSTREAM-EXTENSION.patch` (apply to `packages/client/ui-conversation/`):

- `tests/apply-inject.client.spec.tsx` — new case: absent provider resolves `DEFAULT_STATUS_LABEL`; a provided `conversationStatus` wins per call.
- `tests/chat-view.client.spec.tsx` — harness now supplies the `statusLabel` inject; the status renders the injected label.
- Full `pnpm run test:gui` and `pnpm run typecheck` pass locally on the same changes.

## Related

- Provider plugin: `alingalingling/ui-status-label` (npm/dsh plugin `dsh-ui-status-label`) — already ships `conversationStatus` + a DOM fallback that goes inert once this lands.
