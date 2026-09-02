/**
 * Running-turn status text policy. It owns the live status label shown next to
 * the running clock and writes changes back to the durable status-label
 * settings; ui-conversation's chat view consumes the value through the
 * optional `conversationStatus` service this plugin provides.
 */
import {
  createCompatSnapshotStore, type SettingsScope, type SnapshotStore,
} from './store-compat.ts'
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
  readonly statusLabel: SnapshotStore<string> = createCompatSnapshotStore(DEFAULT_STATUS_LABEL)
  private readonly host: SettingsScope<StatusLabelSettings> | undefined

  /**
   * @param host - durable settings scope owned by the providing plugin;
   * absent compositions stay process-local. The adoption subscription shares
   * the scope's plugin lifetime — a disposed scope never publishes again, so
   * the policy needs no release hook.
   */
  constructor(host?: SettingsScope<StatusLabelSettings>) {
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
   * Adopt the scope's accepted durable text without writing it back.
   * @param host - the constructor-narrowed scope driving this adoption.
   */
  private adopt(host: SettingsScope<StatusLabelSettings>): void {
    const section = host.getSnapshot().value
    if (section === undefined || this.statusLabel.getSnapshot() === section.statusLabel) return
    this.statusLabel.set(section.statusLabel)
  }
}
