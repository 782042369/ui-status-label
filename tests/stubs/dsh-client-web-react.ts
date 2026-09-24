/**
 * Standalone vitest stub for the shell-served `@deepseek-ai/dsh-client-web-react`
 * module (frozen table, not runnable under vitest — see dsh-client-runtime-client
 * stub). `bindSnapshotSelector` binds a store (optionally through a selector)
 * into a React hook; the identity-selector form is all this plugin's tests use.
 */
import { useSyncExternalStore } from 'react'
import type { SnapshotStore } from './dsh-client-runtime-client.ts'

/** Bind a snapshot store into a React hook over `selector(store)`. */
export function bindSnapshotSelector<T, S = T>(
  store: SnapshotStore<T>,
  selector: (snapshot: T) => S = (snapshot: T) => snapshot as unknown as S,
): () => S {
  let memoized: { store: SnapshotStore<T>, value: S } | undefined
  return () => useSyncExternalStore(
    store.subscribe,
    () => {
      if (memoized === undefined || memoized.store !== store) {
        memoized = { store, value: selector(store.getSnapshot()) }
      } else {
        memoized.value = selector(store.getSnapshot())
      }
      return memoized.value
    },
  )
}
