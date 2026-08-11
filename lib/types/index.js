/**
 * Status-label plugin, node half. Registers the durable `ui-status-label`
 * settings namespace when a settings provider exists; the browser half ships
 * via exports["./client"], discovered through the package.json dsh.client
 * declaration.
 */
import { settingsNamespace } from '@deepseek-ai/dsh-settings';
import { STATUS_NAMESPACE, StatusLabelSettingsSchema } from "./status-settings.js";
export { DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD, STATUS_NAMESPACE, } from "./status-settings.js";
/**
 * Register the durable status-label section when a settings provider exists.
 * @param ctx - Host context whose optional settings service owns the section.
 */
export function apply(ctx) {
    ctx.inject(['settings'], (settingsCtx) => {
        settingsCtx.settings.register(settingsNamespace(STATUS_NAMESPACE), StatusLabelSettingsSchema);
    });
}
//# sourceMappingURL=index.js.map