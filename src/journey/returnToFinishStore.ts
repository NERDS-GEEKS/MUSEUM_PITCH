export type ReturnToFinishMode = "none" | "finish";

let returnToFinishMode: ReturnToFinishMode = "none";

/** Persist across route changes while the SPA bundle stays loaded. */
export function requestReturnToFinish(): void {
  returnToFinishMode = "finish";
}

/**
 * Consume the request on next mount so browser back restores the finish wall once.
 * Safe to call multiple times (e.g. strict mode) because it resets to "none".
 */
export function consumeReturnToFinish(): boolean {
  const should = returnToFinishMode === "finish";
  returnToFinishMode = "none";
  return should;
}

