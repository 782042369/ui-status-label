/** Durable status-label schema; node-half only, so the browser bundle never depends on schemastery. */
import z from '@deepseek-ai/schemastery';
import { DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD } from "./status-settings.js";
/** Durable status-label schema; also the wire envelope the browser scope validates against. */
export const StatusLabelSettingsSchema = z.object({
    [STATUS_LABEL_FIELD]: z.string().default(DEFAULT_STATUS_LABEL),
});
//# sourceMappingURL=schema.js.map