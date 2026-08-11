/** Running-turn status preference: constants and the section type shared by the node and browser halves. */

/** Settings namespace owned by this plugin. */
export const STATUS_NAMESPACE = 'ui-status-label'

/** Field carrying the running-turn status text shown in the chat view. */
export const STATUS_LABEL_FIELD = 'statusLabel'

/**
 * Default status text. Mirrors the ui-conversation extension-point default
 * (`DEFAULT_STATUS_LABEL`) so composing this provider in or out leaves the
 * chat-view label unchanged; keep both in sync.
 */
export const DEFAULT_STATUS_LABEL = '小难梁在0721'

/** Durable status-label section shared by the Host schema and the browser scope. */
export interface StatusLabelSettings {
  /** Status text shown while a turn is running. */
  statusLabel: string
}
