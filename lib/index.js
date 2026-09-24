import z from "@deepseek-ai/schemastery";
//#region src/status-settings.ts
/** Running-turn status preference: constants and the section type shared by the node and browser halves. */
/**
* Settings identity owned by this plugin: the profile entry id this bundle's
* cordis.patch.yml inserts, under which the forms service serves the entry's
* volatile `statusLabel` config field.
*/
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
/** Entry configuration: the volatile `statusLabel` field configForms serves; node-half only, so the browser bundle never depends on schemastery. */
/**
* The plugin entry's configuration schema. Only `.volatile()` fields are
* exposed through the settings forms service (`configForms`), which the
* browser half reads and writes under this entry's profile id.
*/
const Config = z.object({ [STATUS_LABEL_FIELD]: z.string().default(DEFAULT_STATUS_LABEL).volatile() });
//#endregion
//#region src/index.ts
/**
* Keep the auto-generated Plugins-page form out: this plugin presents its
* single field itself through the General settings row. Reads and writes
* through configForms are unaffected — the policy only stops the generated
* presentation, per the dsh-settings own-page contract.
* @param ctx - Host context whose optional settings service owns the presentation policy.
*/
function apply(ctx) {
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
	});
}
//#endregion
export { Config, DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD, STATUS_NAMESPACE, apply };
