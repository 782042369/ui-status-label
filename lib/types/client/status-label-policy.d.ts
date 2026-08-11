/**
 * Running-turn status text policy. It owns the live status label shown next to
 * the running clock and writes changes back to the durable status-label
 * settings; ui-conversation's chat view consumes the value through the
 * optional `conversationStatus` service this plugin provides.
 */
import { type SettingsScope, type SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { StatusLabelSettings } from '../status-settings.ts';
export { DEFAULT_STATUS_LABEL } from '../status-settings.ts';
/**
 * Status-label policy used by both the settings row and the provided
 * conversationStatus service. The live value publishes before the durable
 * write starts, so the next turn renders the accepted text immediately.
 */
export declare class StatusLabelPolicy {
    /** Reactive status text source for the Settings row and the service. */
    readonly statusLabel: SnapshotStore<string>;
    private readonly host;
    /**
     * @param host - durable settings scope owned by the providing plugin;
     * absent compositions stay process-local. The adoption subscription shares
     * the scope's plugin lifetime — a disposed scope never publishes again, so
     * the policy needs no release hook.
     */
    constructor(host?: SettingsScope<StatusLabelSettings>);
    /**
     * Change the running-turn status text; the live value publishes before the
     * durable write starts.
     * @param text - the next status label.
     */
    setStatusLabel(text: string): void;
    /**
     * Adopt the scope's accepted durable text without writing it back.
     * @param host - the constructor-narrowed scope driving this adoption.
     */
    private adopt;
}
//# sourceMappingURL=status-label-policy.d.ts.map