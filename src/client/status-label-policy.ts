/**
 * Running-turn status text policy. It owns the live status label shown next to
 * the running clock and writes changes back to the durable status-label
 * settings; ui-conversation's chat view consumes the value through the
 * optional `conversationStatus` service this plugin provides.
 */
import {
  createSnapshotStore, type SnapshotStore,
} from '@deepseek-ai/dsh-client-store'
// Type-only: the ConfigForm face over this entry's volatile config. Cross-plugin
// collaboration goes through the service, never a value import (client bundle
// purity gate).
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import { DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD } from '../status-settings.ts'
import type { StatusLabelSettings } from '../status-settings.ts'

export { DEFAULT_STATUS_LABEL } from '../status-settings.ts'

/**
 * Status-label policy used by both the settings row and the provided
 * conversationStatus service. The live value publishes before the durable
 * write starts, so the next turn renders the accepted text immediately.
 */
export class StatusLabelPolicy {
  /** Reactive status text source for the Settings row and the service. */
  readonly statusLabel: SnapshotStore<string> = createSnapshotStore(DEFAULT_STATUS_LABEL)
  private readonly host: ConfigForm<StatusLabelSettings> | undefined

  /**
   * @param host - shared form over this entry's volatile config; absent
   * compositions stay process-local, and an `unavailable` form (namespace not
   * served, or a connection keeping preferences process-local) simply never
   * adopts. The adoption subscription shares the form's service lifetime — a
   * disposed form never publishes again, so the policy needs no release hook.
   */
  constructor(host?: ConfigForm<StatusLabelSettings>) {
    this.host = host
    if (host !== undefined) {
      host.subscribe(() => { this.adopt(host) })
      this.adopt(host)
    }
  }

  /**
   * Change the running-turn status text; the live value publishes before the
   * durable write starts.
   * @param text - the next status label.
   */
  setStatusLabel(text: string): void {
    if (this.statusLabel.getSnapshot() === text) return
    this.statusLabel.set(text)
    void this.host?.set(STATUS_LABEL_FIELD, text)
  }

  /**
   * Resolve the label actually shown: an empty stored value (the user cleared
   * the field) falls back to the default, so a blank input never renders an
   * empty status line.
   * @returns the effective status text.
   */
  getDisplayLabel(): string {
    return this.statusLabel.getSnapshot() || DEFAULT_STATUS_LABEL
  }

  /**
   * Adopt the form's accepted durable text without writing it back. Before
   * the first accepted section (`loading`/`unavailable`) the snapshot carries
   * no value and the live label keeps whatever it holds.
   * @param host - the constructor-narrowed form driving this adoption.
   */
  private adopt(host: ConfigForm<StatusLabelSettings>): void {
    const section = host.getSnapshot().value
    if (section === undefined || this.statusLabel.getSnapshot() === section.statusLabel) return
    this.statusLabel.set(section.statusLabel)
  }
}
