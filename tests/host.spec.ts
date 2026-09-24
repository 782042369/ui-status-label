import { describe, expect, it } from 'vitest'
import { Config, DEFAULT_STATUS_LABEL, STATUS_LABEL_FIELD } from 'dsh-ui-status-label'

describe('ui-status-label host', () => {
  it('serves the statusLabel default through the entry config schema', () => {
    // Volatile fields resolve to live references; read the accepted value.
    const resolved = Config({})
    expect(resolved[STATUS_LABEL_FIELD].get()).toBe(DEFAULT_STATUS_LABEL)
  })

  it('accepts an explicit statusLabel override', () => {
    const resolved = Config({ [STATUS_LABEL_FIELD]: '新文案' })
    expect(resolved[STATUS_LABEL_FIELD].get()).toBe('新文案')
  })
})
