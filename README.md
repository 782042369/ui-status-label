# dsh-ui-status-label

把你的鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子。

为 **dsh Web** 聊天视图提供可配置的运行中轮次状态文案：General 设置区的一行文本输入，插件把聊天视图运行状态栏的文案替换为你输入的文字（支持 DOM 注入和上游 `conversationStatus` 服务两条路径，见[兼容性](#兼容性)）。插件注册持久的 `ui-status-label` settings 命名空间（默认 `小难梁在0721`）；在设置行输入新文字后，聊天视图在轮次运行期间（等待首 token、工具执行、流式输出）显示的状态文案随之更新。选择持久化在 `$DSH_HOME/settings.yaml`，跟随同一个用户 home 跨越 Web 端口。

## 前提

- **dsh Web**（`dsh --profile web` 或自定义 Web 组合）。本插件只面向浏览器交互面；headless/TUI profile 装它没有意义。
- 依赖分两类：`@deepseek-ai/cordis`、`dsh-client-*` 等为 **peer 依赖**（由 dsh 安装提供）；`@deepseek-ai/dsh-settings`、`schemastery` 为**直接依赖**（从 npm 安装）。官方 npm 发布链尚不完整（如 `@deepseek-ai/dsh-compact` 未发布），完整 `pnpm install` 仍会失败——请用 `dsh plugin add` 安装。

## 安装

本包声明了 `dsh.bundle`，`dsh plugin add` 会自动激活它的 `cordis.patch.yml` 层。

```sh
# 用发布的 tarball（推荐，内含预构建 lib/）
dsh plugin --profile web add ./dsh-ui-status-label-0.1.0.tgz

# 或直接从本 git 仓库安装（会跑 prepare 构建）
dsh plugin --profile web add github:alingalingling/ui-status-label

# 或从 npm（发布后可用）
dsh plugin --profile web add dsh-ui-status-label
```

卸载用 `dsh plugin --profile web remove dsh-ui-status-label`。

> 仅在使用内置了本插件的定制 dsh 构建（如 deepseek-harness 仓库本地构建）时，不要重复安装——`ui-status-label` settings 命名空间会注册两次。官方发布版未内置本插件，正常安装即可。

## 兼容性

本插件同时提供两条生效路径，**官方正式版（含 0.1.0-rc.6）即可直接生效**：

1. **DOM 注入（默认兜底）**：插件监听聊天视图的运行状态元素，把官方硬编码的 `Deep diving...` 文本替换为你配置的文案。不依赖官方任何新机制，装完即用。
2. **`conversationStatus` 可选服务**：当 ui-conversation 带上了扩展点（随 `UPSTREAM-EXTENSION.patch` 合入官方后），聊天视图直接渲染你配置的文案，DOM 注入自动让位，两者不会冲突。

- 安装请用 `dsh plugin add`，不要单独 `pnpm install` 期望完整解析（官方 npm 发布链尚不完整，部分传递依赖未发布；本仓库的 `pnpm-workspace.yaml` 为此关闭了 peer 自动安装）。

## 设置

安装后，修改入口在 dsh Web 页面里：

1. 打开 dsh Web 页面（默认 `http://127.0.0.1:3080`）
2. 点击页面左下角的**齿轮图标**，打开设置面板
3. 在左侧导航选择 **General（通用）** 分区
4. 找到「**运行状态文案**」一行，在输入框里输入你想要的文字（例如"努力干活中"）
5. **输入即生效，无需保存**——下次智能体运行期间，聊天视图的状态行就会显示你输入的文字

清空输入框会回到默认文案 `小难梁在0721`。文案按用户而非按会话，上限 40 字符。

## 从源码构建

```sh
pnpm install        # 安装本地依赖（dsh-settings、schemastery 等已发布 npm 的直接依赖）
pnpm run bundle     # 产出 lib/index.js（node 半边）+ lib/client.js（浏览器半边）
pnpm pack           # tarball，含 lib/ 与 cordis.patch.yml
```

peer 依赖（dsh-* 核心包）按设计不在此解析——它们由 dsh 运行时提供。类型声明（`lib/types`）在 monorepo 构建中生成；tarball 会携带它们。git 安装通过 `prepare` 脚本重建 `lib/`，但不会重新生成 `lib/types`。

## 结构

- `src/schema.ts` — 仅 node 半边；`ui-status-label` 设置 schema（放在浏览器 bundle 之外，运行时不依赖 schemastery）。
- `src/status-settings.ts` — 两个半边共享的常量与 section 类型。
- `src/client/StatusLabelRow.tsx` — General 设置文本行。
- `src/client/status-label-policy.ts` — 实时 snapshot store、持久化写穿、采纳 Host 侧变更，以及空值回退默认。
- `src/client/status-label-injector.ts` — DOM 兜底：把官方硬编码的 `Deep diving...` 文本替换为配置文案（上游合入扩展点后自动让位）。
- `src/client/index.ts` — 注册设置行、提供 `conversationStatus` 服务并启动 DOM 注入器；把本插件从 cordis.yml 组合掉后，ui-conversation 的内置文案保持原样。

## 模型体验

无——设置行与服务只影响浏览器呈现；本包不会触及任何模型请求。
