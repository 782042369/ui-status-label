/**
 * Cross-version snapshot-store access for the dsh Web browser module table.
 * dsh-client `>= 0.1.2-alpha` shares the store through the
 * `@deepseek-ai/dsh-client-store` platform module, while legacy hosts
 * (`<= 0.1.1-rc`) expose the identical surface from the
 * `@deepseek-ai/dsh-client-runtime/client` entry. The loader resolves the
 * first available one at runtime so the same bundle boots on both.
 * @module dsh-ui-status-label/store-compat
 */

/** Minimal reactive snapshot-store surface this plugin consumes. */
export interface SnapshotStore<T> {
  /** Read the current snapshot. */
  getSnapshot(): T
  /** Publish the next snapshot and notify subscribers. */
  set(value: T): void
  /** Subscribe to snapshot commits; returns the unsubscribe handle. */
  subscribe(listener: () => void): () => void
}

/** Factory module shape shared by both host generations. */
export interface SnapshotStoreModule {
  /** Create a snapshot store seeded with an initial value. */
  createSnapshotStore: <T>(initial: T) => SnapshotStore<T>
}

/** Minimal durable settings-scope surface this plugin consumes. */
export interface SettingsScope<T> {
  /** Read the latest accepted scope snapshot. */
  getSnapshot(): { value: T | undefined }
  /** Subscribe to accepted scope snapshots; returns the unsubscribe handle. */
  subscribe(listener: () => void): () => void
  /** Write one field of the durable section. */
  set<K extends keyof T>(field: K, value: T[K]): void | Promise<void>
}

/** Test seam: module injected by specs that run without a dsh module table. */
let testOverride: SnapshotStoreModule | undefined

/**
 * Inject a snapshot-store module for test environments (vitest/vite) where
 * the bundle-factory `require` does not exist.
 * @param module_ - the module exposing `createSnapshotStore`.
 */
export function setSnapshotStoreModuleForTests(module_: SnapshotStoreModule): void {
  testOverride = module_
}

/** Resolved module cache; the browser table is immutable after boot. */
let resolved: SnapshotStoreModule | undefined

/**
 * Resolve the host's snapshot-store module: alpha hosts share
 * `@deepseek-ai/dsh-client-store`; legacy hosts expose it from
 * `@deepseek-ai/dsh-client-runtime/client`.
 * @returns the module exposing `createSnapshotStore`.
 * @throws when neither module id is available (for example a bare test
 * runner that did not call {@link setSnapshotStoreModuleForTests}).
 */
function resolveSnapshotStoreModule(): SnapshotStoreModule {
  if (testOverride !== undefined) return testOverride
  if (typeof require === 'function') {
    try {
      // dsh-client >= 0.1.2-alpha: the store is its own platform module.
      return require('@deepseek-ai/dsh-client-store') as SnapshotStoreModule
    } catch {
      // dsh-client <= 0.1.1-rc: the same surface ships from the runtime entry.
      return require('@deepseek-ai/dsh-client-runtime/client') as SnapshotStoreModule
    }
  }
  throw new Error(
    'dsh-ui-status-label: no snapshot-store module available — expected '
    + '@deepseek-ai/dsh-client-store (dsh-client >= 0.1.2-alpha) or '
    + '@deepseek-ai/dsh-client-runtime/client (legacy hosts); in tests, call '
    + 'setSnapshotStoreModuleForTests first',
  )
}

/**
 * Create a snapshot store through the host-compatible module (lazily resolved
 * and cached), so constructing the policy works on both host generations.
 * @param initial - the seed snapshot.
 * @returns the live snapshot store.
 */
export function createCompatSnapshotStore<T>(initial: T): SnapshotStore<T> {
  resolved ??= resolveSnapshotStoreModule()
  return resolved.createSnapshotStore(initial)
}
