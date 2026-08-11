# dsh-ui-status-label

Configurable running-turn status text for the **dsh Web** chat view: a General Settings text row plus the optional `conversationStatus` service the conversation chat view reads next to its running clock. The plugin registers the durable `ui-status-label` settings namespace (default `小难梁在0721`); typing a new label into the settings row updates what the chat view shows while a turn runs (first-token wait, tool execution, streaming). The choice persists in `$DSH_HOME/settings.yaml`, so it follows the same user home across Web ports.

## Prerequisites

- **dsh Web** (`dsh --profile web`, or a custom Web composition). The plugin is browser-surface-only; headless/TUI profiles gain nothing.
- All `@deepseek-ai/*` dependencies are **peer dependencies provided by the dsh installation** — they are not published to the public npm registry. Do not `pnpm install` this package standalone expecting them to resolve; `.npmrc` / `pnpm-workspace.yaml` in this repo disable pnpm's peer auto-install for that reason.

## Install

The package declares `dsh.bundle`, so `dsh plugin add` activates its `cordis.patch.yml` layer automatically.

```sh
# From a published tarball (recommended; contains prebuilt lib/)
dsh plugin --profile web add ./dsh-ui-status-label-0.1.0.tgz

# Or directly from this git repository (runs the prepare build)
dsh plugin --profile web add github:dsh-external/ui-status-label
```

Remove it with `dsh plugin --profile web remove dsh-ui-status-label`.

> If your dsh release already mounts the `ui-status-label` row in-box through `@deepseek-ai/dsh-web-app`, do not install this package standalone as well — the `ui-status-label` settings namespace would register twice.

## Settings

General Settings → `运行状态文案` (Running status text): the text field's value is the label the chat view shows while a turn runs. Clearing the field keeps the schema default `小难梁在0721`. The label is per-user, not per-session, and capped at 40 characters.

## Building from source

```sh
pnpm install        # dev tooling only; @deepseek-ai peers stay unresolved by design
pnpm run bundle     # emits lib/index.js (node half) + lib/client.js (browser half)
pnpm pack           # tarball with lib/ + cordis.patch.yml
```

Type declarations (`lib/types`) are generated in the monorepo build; the tarball ships them. A git install rebuilds `lib/` through the `prepare` script but does not regenerate `lib/types`.

## Architecture

- `src/schema.ts` — node-half only; the `ui-status-label` settings schema (kept out of the browser bundle so it never depends on schemastery at runtime).
- `src/status-settings.ts` — constants and the section type shared by both halves.
- `src/client/StatusLabelRow.tsx` — the General Settings text row.
- `src/client/status-label-policy.ts` — live snapshot store, durable write-through, and adoption of Host-side changes.
- `src/client/index.ts` — registers the row and provides the `conversationStatus` service; composing this plugin out of cordis.yml leaves ui-conversation's built-in label in place.

## Model Experience

None — the settings row and service only feed browser presentation; nothing here reaches a model request.
