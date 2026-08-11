import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";
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
//#region src/schema.ts
/** Durable status-label schema; node-half only, so the browser bundle never depends on schemastery. */
/** Durable status-label schema; also the wire envelope the browser scope validates against. */
const StatusLabelSettingsSchema = z.object({ [STATUS_LABEL_FIELD]: z.string().default(DEFAULT_STATUS_LABEL) });
//#endregion
//#region src/index.ts
/**
* Register the durable status-label section when a settings provider exists.
* @param ctx - Host context whose optional settings service owns the section.
*/
function apply(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.register(settingsNamespace(STATUS_NAMESPACE), StatusLabelSettingsSchema);
	});
}
//#endregion
export { DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD, STATUS_NAMESPACE, apply };
