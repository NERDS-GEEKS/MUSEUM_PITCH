/** Skip look-drag / journey swipe when the user is tapping controls. */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target instanceof HTMLElement) {
    const tag = target.tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      tag === "BUTTON" ||
      tag === "A" ||
      tag === "LABEL"
    ) {
      return true;
    }
    if (target.isContentEditable) return true;
  }
  return Boolean(
    target.closest(
      "a, button, input, textarea, select, label, form, [role='button'], [data-allow-scroll], [data-footer-interactive]",
    ),
  );
}
