/** Running-turn status preference stored in the Host user-settings document. */
import z from '@deepseek-ai/schemastery';
/** Settings namespace owned by this plugin. */
export declare const STATUS_NAMESPACE = "ui-status-label";
/** Field carrying the running-turn status text shown in the chat view. */
export declare const STATUS_LABEL_FIELD = "statusLabel";
/**
 * Default status text. Mirrors the ui-conversation extension-point default
 * (`DEFAULT_STATUS_LABEL`) so composing this provider in or out leaves the
 * chat-view label unchanged; keep both in sync.
 */
export declare const DEFAULT_STATUS_LABEL = "\u5C0F\u96BE\u6881\u57280721";
/** Durable status-label section shared by the Host schema and the browser scope. */
export interface StatusLabelSettings {
    /** Status text shown while a turn is running. */
    statusLabel: string;
}
/** Durable status-label schema; also the wire envelope the browser scope validates against. */
export declare const StatusLabelSettingsSchema: z<StatusLabelSettings>;
//# sourceMappingURL=status-settings.d.ts.map