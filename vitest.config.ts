/**
 * Standalone vitest config. The dsh shell serves a frozen module table in the
 * browser; the shell-owned platform modules it shares there (the runtime
 * store primitives and the web-react binding helpers) cannot execute under
 * vitest, so their specifiers alias to the faithful local stubs in
 * tests/stubs. Everything else runs from source.
 */
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@deepseek-ai/dsh-client-runtime/client',
        replacement: fileURLToPath(new URL('./tests/stubs/dsh-client-runtime-client.ts', import.meta.url)),
      },
      {
        find: '@deepseek-ai/dsh-client-web-react',
        replacement: fileURLToPath(new URL('./tests/stubs/dsh-client-web-react.ts', import.meta.url)),
      },
      {
        find: '@deepseek-ai/dsh-client-test-runtime',
        replacement: fileURLToPath(new URL('./tests/stubs/dsh-client-test-runtime.ts', import.meta.url)),
      },
    ],
  },
})
