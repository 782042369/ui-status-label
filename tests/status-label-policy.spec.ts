// @vitest-environment jsdom
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { stubSettingsScope } from '@deepseek-ai/dsh-client-test-runtime'
import { StatusLabelPolicy, DEFAULT_STATUS_LABEL } from '../src/client/status-label-policy.ts'
import { setSnapshotStoreModuleForTests } from '../src/client/store-compat.ts'
import type { StatusLabelSettings } from '../src/status-settings.ts'

beforeAll(async () => {
  // The policy resolves createSnapshotStore through the browser module table
  // (store package on alpha hosts, runtime entry on legacy hosts); vite specs
  // have no bundle-factory require, so hand it whichever module this checkout
  // ships.
  try {
    setSnapshotStoreModuleForTests(await import('@deepseek-ai/dsh-client-store'))
  } catch {
    setSnapshotStoreModuleForTests(await import('@deepseek-ai/dsh-client-runtime/client'))
  }
})

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

  it('writes an explicit change through the scope after publishing it locally', () => {
    const host = stubSettingsScope<StatusLabelSettings>()
    const policy = new StatusLabelPolicy(host.scope)
    policy.setStatusLabel('新文案')
    expect(host.set).toHaveBeenCalledWith('statusLabel', '新文案')
    expect(host.set).toHaveBeenCalledOnce()
  })

  it('adopts a durable section without writing it back and leaves an identical write untouched', () => {
    const host = stubSettingsScope<StatusLabelSettings>()
    const policy = new StatusLabelPolicy(host.scope)
    host.publish({ status: 'ready', value: { statusLabel: '来自文档' }, revision: 1, writable: true })
    expect(policy.statusLabel.getSnapshot()).toBe('来自文档')
    policy.setStatusLabel('来自文档')
    expect(host.set).not.toHaveBeenCalled()
    host.publish({ value: { statusLabel: '来自文档' }, revision: 2 })
    expect(policy.statusLabel.getSnapshot()).toBe('来自文档')
  })
})
