/**
 * Running-turn status text policy. It owns the live status label shown next to
 * the running clock and writes changes back to the durable status-label
 * settings; ui-conversation's chat view consumes the value through the
 * optional `conversationStatus` service this plugin provides.
 */
import { type SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
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
     * @param host - shared form over this entry's volatile config; absent
     * compositions stay process-local, and an `unavailable` form (namespace not
     * served, or a connection keeping preferences process-local) simply never
     * adopts. The adoption subscription shares the form's service lifetime — a
     * disposed form never publishes again, so the policy needs no release hook.
     */
    constructor(host?: ConfigForm<StatusLabelSettings>);
    /**
     * Change the running-turn status text; the live value publishes before the
     * durable write starts.
     * @param text - the next status label.
     */
    setStatusLabel(text: string): void;
    /**
     * Resolve the label actually shown: an empty stored value (the user cleared
     * the field) falls back to the default, so a blank input never renders an
     * empty status line.
     * @returns the effective status text.
     */
    getDisplayLabel(): string;
    /**
     * Adopt the form's accepted durable text without writing it back.
     * @param host - the constructor-narrowed form driving this adoption.
     */
    private adopt;
}
//# sourceMappingURL=status-label-policy.d.ts.map
