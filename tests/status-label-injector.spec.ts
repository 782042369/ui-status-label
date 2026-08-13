// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import { installStatusLabelInjector } from '../src/client/status-label-injector.ts'

afterEach(() => {
  document.body.innerHTML = ''
})

/** Official TurnStatus markup: status div with the hard-coded text plus the running-clock span. */
function mountOfficialTurnStatus(): HTMLElement {
  const div = document.createElement('div')
  div.setAttribute('role', 'status')
  div.setAttribute('aria-live', 'polite')
  div.appendChild(document.createTextNode('Deep diving...'))
  const clock = document.createElement('span')
  clock.setAttribute('aria-hidden', 'true')
  clock.textContent = '2分05秒'
  div.appendChild(clock)
  document.body.appendChild(div)
  return div
}

describe('installStatusLabelInjector', () => {
  it('replaces the official hard-coded text with the configured label, keeping the clock', () => {
    const label = createSnapshotStore('自定义文案')
    const dispose = installStatusLabelInjector(label)
    const div = mountOfficialTurnStatus()
    // The injector runs immediately and again on the mount mutation.
    const textNode = div.childNodes[0] as Text
    expect(textNode.nodeValue).toBe('自定义文案')
    expect(div.childNodes[1]?.textContent).toBe('2分05秒')
    dispose()
  })

  it('replaces a status element mounted after install and keeps tracking live changes', () => {
    const label = createSnapshotStore('努力干活中')
    const dispose = installStatusLabelInjector(label)
    const div = mountOfficialTurnStatus()
    expect((div.childNodes[0] as Text).nodeValue).toBe('努力干活中')
    // A preference change rewrites already-injected elements.
    label.set('新文案')
    expect((div.childNodes[0] as Text).nodeValue).toBe('新文案')
    dispose()
  })

  it('leaves an already-custom label (upstream provider path) untouched', () => {
    const label = createSnapshotStore('自定义文案')
    const dispose = installStatusLabelInjector(label)
    const div = document.createElement('div')
    div.setAttribute('role', 'status')
    div.appendChild(document.createTextNode('官方文案'))
    document.body.appendChild(div)
    expect((div.childNodes[0] as Text).nodeValue).toBe('官方文案')
    dispose()
  })

  it('stops replacing after disposal', () => {
    const label = createSnapshotStore('自定义文案')
    const dispose = installStatusLabelInjector(label)
    dispose()
    const div = mountOfficialTurnStatus()
    expect((div.childNodes[0] as Text).nodeValue).toBe('Deep diving...')
  })
})
