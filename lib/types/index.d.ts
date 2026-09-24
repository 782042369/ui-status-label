/**
 * Status-label plugin, node half. The durable preference is this entry's
 * volatile `statusLabel` config field (schema in ./schema.ts), served to the
 * browser through the settings forms service; the browser half ships via
 * exports["./client"], discovered through the package.json dsh.client
 * declaration.
 */
import type { Context } from '@deepseek-ai/cordis';
export { Config } from './schema.ts';
export { DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD, STATUS_NAMESPACE, type StatusLabelSettings, } from './status-settings.ts';
/**
 * Keep the auto-generated Plugins-page form out: this plugin presents its
 * single field itself through the General settings row. Reads and writes
 * through configForms are unaffected — the policy only stops the generated
 * presentation, per the dsh-settings own-page contract.
 * @param ctx - Host context whose optional settings service owns the presentation policy.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map
