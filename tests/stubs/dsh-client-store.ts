/**
 * Standalone vitest stub for the frozen-module-table runtime export the dsh
 * shell serves in the browser (`@deepseek-ai/dsh-client-store`). The
 * npm-published wrapper can only execute inside the shell's `__ModuleLoader__`
 * table, so tests alias the subpath here instead. Only the surface this
 * plugin's tests touch is provided: the snapshot store primitives.
 */

/** Minimal reactive snapshot value: read, replace, observe. */
export interface SnapshotStore<T> {
  getSnapshot(): T
  set(value: T): void
  subscribe(listener: () => void): () => void
}

/** Shape tests seed; the real type lives in the shell-served module. */
export type SessionListState = Record<string, unknown>
/** Shape tests seed; the real type lives in the shell-served module. */
export type WorkspaceListState = Record<string, unknown>

/** Create a snapshot store over an initial value. */
export function createSnapshotStore<T>(initial: T): SnapshotStore<T> {
  let snapshot = initial
  const listeners = new Set<() => void>()
  return {
    getSnapshot: () => snapshot,
    set: (value: T) => {
      if (Object.is(snapshot, value)) return
      snapshot = value
      for (const listener of listeners) listener()
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
}
