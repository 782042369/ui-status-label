// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import { createSnapshotStore, type SessionListState, type WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'
import { makeTranslate } from '@deepseek-ai/dsh-client-test-runtime'
// Type-only: loads the LocaleNamespaceMap merge that types PropsLocale<'status-label'>.
import type {} from '../src/client/index.ts'
import { StatusLabelRow } from '../src/client/StatusLabelRow.tsx'
import type { StatusLabelRowProps } from '../src/client/StatusLabelRow.tsx'
import { StatusLabelPolicy } from '../src/client/status-label-policy.ts'
import { en } from '../src/client/locales.ts'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function emptySessions() {
  return bindSnapshotSelector(createSnapshotStore<SessionListState>({
    ids: [], byId: {}, current: undefined, phase: 'ready', subagentsByParent: {}, tasksBySession: {}, currentAddress: undefined,
  }))
}

function emptyWorkspaces() {
  return bindSnapshotSelector(createSnapshotStore<WorkspaceListState>({
    items: [], archivedSessionIds: [], state: 'idle', phase: 'ready', error: null,
    baselinesReady: true, recentWorkspaceId: undefined,
  }))
}

function mount() {
  const policy = new StatusLabelPolicy()
  const setStatusLabel = vi.fn((text: string) => { policy.setStatusLabel(text) })
  const props: StatusLabelRowProps = {
    useSessions: emptySessions(),
    useWorkspaces: emptyWorkspaces(),
    useStatusLabel: bindSnapshotSelector(policy.statusLabel),
    setStatusLabel,
    t: makeTranslate(en),
  }
  render(<StatusLabelRow {...props} />)
  return { policy, setStatusLabel }
}

describe('StatusLabelRow', () => {
  it('explains the running status scope and shows the default label', () => {
    mount()
    expect(screen.getByText('Running status text')).toBeDefined()
    expect(screen.getByText('Status text shown while the agent is running')).toBeDefined()
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('小难梁在0721')
  })

  it('writes typed text through the policy and follows later changes', () => {
    const b = mount()
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '努力思考中' } })
    expect(b.setStatusLabel).toHaveBeenCalledWith('努力思考中')
    expect(b.policy.statusLabel.getSnapshot()).toBe('努力思考中')
    expect(input.value).toBe('努力思考中')
  })
})
