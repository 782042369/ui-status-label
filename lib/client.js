window.__ModuleLoader__.load({
	id: "dsh-ui-status-label",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region \0dsh-css:C:\Users\lingyan\dsh-ui-status-label\src\client\StatusLabelRow.module.css.mjs
		const css = ".yu6jra_row{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:center;gap:8px;padding:16px 0;display:flex}.yu6jra_rowText{flex-direction:column;flex:1;gap:4px;min-width:0;padding-right:48px;display:flex}.yu6jra_title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}.yu6jra_desc{color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;line-height:18px}.yu6jra_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);width:200px;height:36px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:18px;outline:none;padding:0 14px;font-size:14px;line-height:22px}.yu6jra_input:focus{border-color:var(--dsw-alias-label-primary)}.yu6jra_input::placeholder{color:var(--dsw-alias-label-tertiary)}";
		const tagId = "dsh-ui-status-label/StatusLabelRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-status-label";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var StatusLabelRow_module_css_default = {
			"rowText": "yu6jra_rowText",
			"title": "yu6jra_title",
			"input": "yu6jra_input",
			"row": "yu6jra_row",
			"desc": "yu6jra_desc"
		};
		//#endregion
		//#region src/client/StatusLabelRow.tsx
		/** Longest status text the row accepts; bounds the chat-view layout. */
		const MAX_STATUS_LABEL_LENGTH = 40;
		/**
		* Render the running-turn status text editor.
		* @param props - composed Settings slot props.
		* @returns the preference row.
		*/
		function StatusLabelRow({ useStatusLabel, setStatusLabel, t }) {
			const label = useStatusLabel((value) => value);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: StatusLabelRow_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: StatusLabelRow_module_css_default.rowText,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: StatusLabelRow_module_css_default.title,
						children: t("settings.status.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: StatusLabelRow_module_css_default.desc,
						children: t("settings.status.description")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					type: "text",
					className: StatusLabelRow_module_css_default.input,
					value: label,
					maxLength: MAX_STATUS_LABEL_LENGTH,
					spellCheck: false,
					onChange: (event) => {
						setStatusLabel(event.target.value);
					}
				})]
			});
		}
		//#endregion
		//#region src/status-settings.ts
		/** Running-turn status preference: constants and the section type shared by the node and browser halves. */
		/** Settings namespace owned by this plugin. */
		const STATUS_NAMESPACE = "ui-status-label";
		/** Field carrying the running-turn status text shown in the chat view. */
		const STATUS_LABEL_FIELD = "statusLabel";
		/**
		* Default status text. Mirrors the ui-conversation extension-point default
		* (`DEFAULT_STATUS_LABEL`) so composing this provider in or out leaves the
		* chat-view label unchanged; keep both in sync.
		*/
		const DEFAULT_STATUS_LABEL = "小难梁在0721";
		//#endregion
		//#region src/client/status-label-policy.ts
		/**
		* Running-turn status text policy. It owns the live status label shown next to
		* the running clock and writes changes back to the durable status-label
		* settings; ui-conversation's chat view consumes the value through the
		* optional `conversationStatus` service this plugin provides.
		*/
		/**
		* Status-label policy used by both the settings row and the provided
		* conversationStatus service. The live value publishes before the durable
		* write starts, so the next turn renders the accepted text immediately.
		*/
		var StatusLabelPolicy = class {
			/** Reactive status text source for the Settings row and the service. */
			statusLabel = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(DEFAULT_STATUS_LABEL);
			host;
			/**
			* @param host - durable settings scope owned by the providing plugin;
			* absent compositions stay process-local. The adoption subscription shares
			* the scope's plugin lifetime — a disposed scope never publishes again, so
			* the policy needs no release hook.
			*/
			constructor(host) {
				this.host = host;
				if (host !== void 0) {
					host.subscribe(() => {
						this.adopt(host);
					});
					this.adopt(host);
				}
			}
			/**
			* Change the running-turn status text; the live value publishes before the
			* durable write starts.
			* @param text - the next status label.
			*/
			setStatusLabel(text) {
				if (this.statusLabel.getSnapshot() === text) return;
				this.statusLabel.set(text);
				this.host?.set(STATUS_LABEL_FIELD, text);
			}
			/**
			* Resolve the label actually shown: an empty stored value (the user cleared
			* the field) falls back to the default, so a blank input never renders an
			* empty status line.
			* @returns the effective status text.
			*/
			getDisplayLabel() {
				return this.statusLabel.getSnapshot() || "小难梁在0721";
			}
			/**
			* Adopt the scope's accepted durable text without writing it back.
			* @param host - the constructor-narrowed scope driving this adoption.
			*/
			adopt(host) {
				const section = host.getSnapshot().value;
				if (section === void 0 || this.statusLabel.getSnapshot() === section.statusLabel) return;
				this.statusLabel.set(section.statusLabel);
			}
		};
		//#endregion
		//#region src/client/status-label-injector.ts
		/** The official hard-coded status text this injector replaces. */
		const OFFICIAL_FALLBACK_TEXT = "Deep diving...";
		/** Selector for the running-turn status element (official markup: `role="status" aria-live="polite"`). */
		const STATUS_SELECTOR = "[role=\"status\"]";
		/**
		* Install the DOM fallback injector.
		* @param label - reactive source of the user-configured status text.
		* @param fallback - text shown when the stored label is empty (cleared field).
		* @returns the disposer removing the observer and the subscription.
		*/
		function installStatusLabelInjector(label, fallback) {
			if (typeof document === "undefined") return () => {};
			const injected = /* @__PURE__ */ new WeakSet();
			const replace = () => {
				const text = label.getSnapshot() || fallback;
				for (const element of document.querySelectorAll(STATUS_SELECTOR)) for (const node of element.childNodes) {
					if (!(node instanceof Text)) continue;
					if (node.nodeValue === text) continue;
					if (node.nodeValue === OFFICIAL_FALLBACK_TEXT || injected.has(node)) {
						node.nodeValue = text;
						injected.add(node);
					}
				}
			};
			replace();
			const observer = new MutationObserver(replace);
			observer.observe(document.body, {
				childList: true,
				characterData: true,
				subtree: true
			});
			const unsubscribe = label.subscribe(replace);
			return () => {
				observer.disconnect();
				unsubscribe();
			};
		}
		//#endregion
		//#region src/client/locales.ts
		/** `status-label` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "status-label";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"settings.status.title": "运行状态文案",
			"settings.status.description": "智能体运行中显示的状态文字"
		};
		/** English dictionary (same key set). */
		const en = {
			"settings.status.title": "Running status text",
			"settings.status.description": "Status text shown while the agent is running"
		};
		//#endregion
		//#region src/client/index.ts
		/** Services required for the settings row registration and its dictionaries. */
		const inject = [
			"slots",
			"settingsScope",
			"locale",
			"connection",
			"remote"
		];
		/**
		* Client plugin body: register the dictionaries, the settings row, and the
		* conversationStatus provider.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const policy = new StatusLabelPolicy(ctx.settingsScope.bind({ namespace: STATUS_NAMESPACE }));
			ctx.effect(() => {
				return ctx.locale.register(NS, {
					zh,
					en
				});
			}, "ui-status-label: dictionaries");
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "status-label",
				order: 30,
				locale: NS,
				inject: () => ({
					hooks: { statusLabel: policy.statusLabel },
					setStatusLabel: (text) => {
						policy.setStatusLabel(text);
					}
				})
			}, StatusLabelRow));
			ctx.provide("conversationStatus", { label: () => policy.getDisplayLabel() });
			ctx.effect(() => installStatusLabelInjector(policy.statusLabel, DEFAULT_STATUS_LABEL), "ui-status-label: dom status injector");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map