/** `status-label` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'status-label'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'settings.status.title': '运行状态文案',
  'settings.status.description': '智能体运行中显示的状态文字',
}

/** Union of this namespace's dictionary keys. */
export type StatusLabelKey = keyof typeof zh

/** English dictionary (same key set). */
export const en: Record<StatusLabelKey, string> = {
  'settings.status.title': 'Running status text',
  'settings.status.description': 'Status text shown while the agent is running',
}
