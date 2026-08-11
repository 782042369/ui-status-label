/** General Settings row for the running-turn status text shown in the chat view. */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import css from './StatusLabelRow.module.css'

/** Longest status text the row accepts; bounds the chat-view layout. */
const MAX_STATUS_LABEL_LENGTH = 40

/** Registration-side status-label face. */
export interface StatusLabelRowInjected {
  hooks: {
    /** Persisted running-turn status text bound as useStatusLabel. */
    statusLabel: SnapshotStore<string>
  }
  /** Change the running-turn status text. */
  setStatusLabel: (text: string) => void
}

/** Full Settings-row props. */
export type StatusLabelRowProps =
  PropsRuntime<'settings.general.item'>
  & PropsLocale<'status-label'>
  & InjectFace<StatusLabelRowInjected>

/**
 * Render the running-turn status text editor.
 * @param props - composed Settings slot props.
 * @returns the preference row.
 */
export function StatusLabelRow({ useStatusLabel, setStatusLabel, t }: StatusLabelRowProps) {
  const label = useStatusLabel(value => value)

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('settings.status.title')}</div>
        <div className={css.desc}>{t('settings.status.description')}</div>
      </div>
      <input
        type="text"
        className={css.input}
        value={label}
        maxLength={MAX_STATUS_LABEL_LENGTH}
        spellCheck={false}
        onChange={(event) => { setStatusLabel(event.target.value) }}
      />
    </div>
  )
}
