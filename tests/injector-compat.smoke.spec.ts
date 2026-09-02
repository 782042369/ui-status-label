/**
 * Standalone compatibility smoke for the DOM fallback injector: no dsh runtime
 * imports — the SnapshotStore shape is stubbed locally so this spec runs with
 * plain vitest+jsdom outside the official monorepo. Covers the official
 * fallback texts across dsh-client releases (old hardcoded en, new i18n en/zh).
 */
// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { installStatusLabelInjector } from '../src/client/status-label-injector.ts'

const DEFAULT = '小难梁在0721'

/** Minimal SnapshotStore stub: one cell, sync subscribers. */
function stubStore(initial: string) {
  let value = initial
  const subs = new Set<() => void>()
  return {
    getSnapshot: () => value,
    set(next: string) { value = next; for (const fn of subs) fn() },
    subscribe(fn: () => void) { subs.add(fn); return () => { subs.delete(fn) } },
  }
}

afterEach(() => { document.body.innerHTML = '' })

/**
 * Mount official TurnStatus markup with a given rendered label.
 * @param text - the official label text for the simulated release/locale.
 */
function mount(text: string): HTMLElement {
  const div = document.createElement('div')
  div.setAttribute('role', 'status')
  div.setAttribute('aria-live', 'polite')
  div.appendChild(document.createTextNode(text))
  const clock = document.createElement('span')
  clock.setAttribute('aria-hidden', 'true')
  clock.textContent = '2分05秒'
  div.appendChild(clock)
  document.body.appendChild(div)
  return div
}

/** MutationObserver callbacks are async in jsdom. */
const flush = () => new Promise<void>((r) => { setTimeout(r, 10) })

 describe('installStatusLabelInjector compatibility', () => {
  it.each([
    ['legacy hardcoded en (<= 0.1.1-rc)', 'Deep diving...'],
    ['i18n en (>= 0.1.2-alpha)', 'Deep diving...'],
    ['i18n zh (>= 0.1.2-alpha)', '深度求索中...'],
    ['unicode ellipsis drift', 'Deep diving…'],
    ['whitespace drift', '  Deep diving...  '],
  ])('replaces %s', async (_name, official) => {
    const label = stubStore('自定义文案')
    const dispose = installStatusLabelInjector(label as any, DEFAULT)
    const div = mount(official)
    await flush()
    expect((div.childNodes[0] as Text).nodeValue).toBe('自定义文案')
    expect(div.childNodes[1]?.textContent).toBe('2分05秒')
    dispose()
  })

  it('leaves an already-custom label (upstream provider path) untouched', async () => {
    const label = stubStore('自定义文案')
    const dispose = installStatusLabelInjector(label as any, DEFAULT)
    const div = mount('官方其他状态')
    await flush()
    expect((div.childNodes[0] as Text).nodeValue).toBe('官方其他状态')
    dispose()
  })

  it('follows live preference changes and falls back on empty', async () => {
    const label = stubStore('努力干活中')
    const dispose = installStatusLabelInjector(label as any, DEFAULT)
    const div = mount('深度求索中...')
    await flush()
    label.set('新文案')
    await flush()
    expect((div.childNodes[0] as Text).nodeValue).toBe('新文案')
    label.set('')
    await flush()
    expect((div.childNodes[0] as Text).nodeValue).toBe(DEFAULT)
    dispose()
  })
})
