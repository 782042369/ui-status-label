//#region src/invariant.ts
const PACKAGE_NAME = "@deepseek-ai/dsh-client-ui-status-label";
/** Cordis companion plugin name. */
const name = "client-ui-status-label-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: one settings-namespace registration, one slot
* registration, and one dictionary registration, all effect-owned with
* disposal proven by the host and row specs — the plugin emits no cordis
* events and owns no cross-plugin mutable state.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
