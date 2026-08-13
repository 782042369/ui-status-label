import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { Settings, settingsNamespace, type SettingsNamespace } from '@deepseek-ai/dsh-settings'
import {
  DEFAULT_STATUS_LABEL, STATUS_NAMESPACE, apply,
} from 'dsh-ui-status-label'

class MemorySettings extends Settings {
  readonly writable = true
  protected load(): Promise<Record<string, unknown>> { return Promise.resolve({}) }
  protected persist(_ns: SettingsNamespace, _section: Record<string, unknown>): Promise<void> {
    return Promise.resolve()
  }
}

describe('ui-status-label host', () => {
  it('registers, validates, and disposes the durable status-label preference', async () => {
    const ctx = new Context()
    await ctx.plugin(MemorySettings).await()
    const fiber = ctx.plugin({ apply })
    await fiber.await()
    const ns = settingsNamespace(STATUS_NAMESPACE)
    expect(ctx.settings.get(ns)).toEqual({ statusLabel: DEFAULT_STATUS_LABEL })
    await ctx.settings.update(ns, { statusLabel: '新文案' })
    expect(ctx.settings.get(ns)).toEqual({ statusLabel: '新文案' })
    await fiber.dispose()
    expect(ctx.settings.describe().map(row => row.ns)).not.toContain(ns)
  })
})
