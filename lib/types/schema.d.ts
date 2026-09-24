/** Entry configuration: the volatile `statusLabel` field configForms serves; node-half only, so the browser bundle never depends on schemastery. */
import z from '@deepseek-ai/schemastery';
import { type StatusLabelSettings } from './status-settings.ts';
/**
 * The plugin entry's configuration schema. Only `.volatile()` fields are
 * exposed through the settings forms service (`configForms`), which the
 * browser half reads and writes under this entry's profile id.
 */
export declare const Config: z<StatusLabelSettings>;
//# sourceMappingURL=schema.d.ts.map
