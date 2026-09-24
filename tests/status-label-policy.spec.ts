// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import type { ConfigForm, ConfigFormSnapshot } from '@deepseek-ai/dsh-client-ui-settings/client'
import { StatusLabelPolicy, DEFAULT_STATUS_LABEL } from '../src/client/status-label-policy.ts'
import type { StatusLabelSettings } from '../src/status-settings.ts'

/** Minimal fake of the shared-forms face the policy consumes. */
function stubConfigForm<T extends object>(): {
  form: ConfigForm<T>
  set: ReturnType<typeof vi.fn>
  publish: (patch: Partial<ConfigFormSnapshot<T>>) => void
} {
  let snapshot: ConfigFormSnapshot<T> = {
    status: 'loading', value: undefined, base: undefined, user: undefined,
    revision: undefined, writable: true, mode: 'host',
  }
  const listeners = new Set<() => void>()
  const set = vi.fn().mockResolvedValue(true)
  const form: ConfigForm<T> = {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    set: (field: string, value: unknown) => set(field, value),
    unset: vi.fn().mockResolvedValue(true),
    mutate: vi.fn().mockResolvedValue(true),
  }
  return {
    form,
    set,
    publish: (patch: Partial<ConfigFormSnapshot<T>>) => {
      snapshot = { ...snapshot, ...patch }
      for (const listener of listeners) listener()
    },
  }
}

describe('StatusLabelPolicy', () => {
  it('defaults to the built-in label and publishes before persisting', () => {
    const policy = new StatusLabelPolicy()
    expect(policy.statusLabel.getSnapshot()).toBe(DEFAULT_STATUS_LABEL)
    const changed = vi.fn()
    policy.statusLabel.subscribe(changed)
    policy.setStatusLabel('新文案')
    expect(changed).toHaveBeenCalledTimes(1)
    expect(policy.statusLabel.getSnapshot()).toBe('新文案')
  })

  it('writes an explicit change through the form after publishing it locally', () => {
    const host = stubConfigForm<StatusLabelSettings>()
    const policy = new StatusLabelPolicy(host.form)
    policy.setStatusLabel('新文案')
    expect(host.set).toHaveBeenCalledWith('statusLabel', '新文案')
    expect(host.set).toHaveBeenCalledOnce()
  })

  it('ignores a form that never serves the namespace', () => {
    const host = stubConfigForm<StatusLabelSettings>()
    const policy = new StatusLabelPolicy(host.form)
    host.publish({ status: 'unavailable' })
    expect(policy.statusLabel.getSnapshot()).toBe(DEFAULT_STATUS_LABEL)
  })

  it('adopts a served section without writing it back and leaves an identical write untouched', () => {
    const host = stubConfigForm<StatusLabelSettings>()
    const policy = new StatusLabelPolicy(host.form)
    host.publish({ status: 'ready', value: { statusLabel: '来自文档' }, revision: 1, writable: true })
    expect(policy.statusLabel.getSnapshot()).toBe('来自文档')
    policy.setStatusLabel('来自文档')
    expect(host.set).not.toHaveBeenCalled()
    host.publish({ value: { statusLabel: '来自文档' }, revision: 2 })
    expect(policy.statusLabel.getSnapshot()).toBe('来自文档')
  })
})
