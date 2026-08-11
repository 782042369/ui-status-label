/** Durable status-label schema; node-half only, so the browser bundle never depends on schemastery. */
import z from '@deepseek-ai/schemastery';
import { type StatusLabelSettings } from './status-settings.ts';
/** Durable status-label schema; also the wire envelope the browser scope validates against. */
export declare const StatusLabelSettingsSchema: z<StatusLabelSettings>;
//# sourceMappingURL=schema.d.ts.map