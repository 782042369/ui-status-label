/**
 * Status-label plugin, node half. Registers the durable `ui-status-label`
 * settings namespace when a settings provider exists; the browser half ships
 * via exports["./client"], discovered through the package.json dsh.client
 * declaration.
 */
import type { Context } from '@deepseek-ai/cordis';
export { DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD, STATUS_NAMESPACE, type StatusLabelSettings, } from './status-settings.ts';
/**
 * Register the durable status-label section when a settings provider exists.
 * @param ctx - Host context whose optional settings service owns the section.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map